import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UUID } from 'crypto';
import { expect } from 'chai';
import { InMemoryVehicleRepository } from '../../repositories/in-memory.vehicle.repository';
import { IVehicleRepository } from '../../repositories/interfaces/vehicle.repository';
import { VehicleModule } from '../../vehicle.module';
import { VEHICLE_UNIQUE_FIELDS } from '../../constants/module.contants';
import { Vehicle, VehicleProps } from '../../entities/vehicle.entity';
import { ListVehicleData } from '../../dto/list-vehicle.dto';
import { VehicleController } from '../../vehicle.controller';
import { ERROR_MESSAGES } from '../../constants/errors.constants';

describe(`${VehicleController.name} (E2E)`, () => {
  let repositorySourceData: Map<UUID, Vehicle>;
  let app: INestApplication;
  let repository: IVehicleRepository;

  const vehicles: VehicleProps[] = [
    {
      brand: 'Toyota',
      chassis: '123',
      model: 'Corolla',
      plate: 'XYZ123',
      renavam: '5678',
      year: 2020,
    },
    {
      brand: 'Honda',
      chassis: '456',
      model: 'Civic',
      plate: 'XYZ456',
      renavam: '6789',
      year: 2021,
    },
    {
      brand: 'Ford',
      chassis: '789',
      model: 'Focus',
      plate: 'XYZ789',
      renavam: '7890',
      year: 2019,
    },
  ];

  describe('GET /vehicle', () => {
    beforeEach(async () => {
      repositorySourceData = new Map();

      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [VehicleModule],
        providers: [
          {
            provide: IVehicleRepository,
            useFactory: () => {
              return new InMemoryVehicleRepository(
                repositorySourceData,
                VEHICLE_UNIQUE_FIELDS,
              );
            },
          },
        ],
      }).compile();

      app = moduleFixture.createNestApplication();
      repository = moduleFixture.get<IVehicleRepository>(IVehicleRepository);

      await app.init();

      for (const vehicle of vehicles) {
        await repository.create({ entity: vehicle });
      }
    });

    afterEach(async () => {
      await app.close();
    });

    it('should return the first page of vehicles', async () => {
      const page = 1;
      const pageSize = 2;

      const response = await request(app.getHttpServer())
        .get('/vehicle')
        .query({ page, pageSize })
        .expect(200);

      const body = response.body as ListVehicleData;

      expect(body.data).to.be.an('array');
      expect(body.data.length).to.equal(2);

      // @ts-expect-error - data is private
      expect(body.data.map(({ props }) => props)).to.deep.include.members([
        vehicles[0],
        vehicles[1],
      ]);

      expect(body.metadata).to.be.an('object');
      expect(body.metadata.page).to.equal(String(page));
      expect(body.metadata.totalPages).to.equal(2);
    });

    it('should return the second page of vehicles', async () => {
      const page = 2;
      const pageSize = 2;

      const response = await request(app.getHttpServer())
        .get('/vehicle')
        .query({ page, pageSize })
        .expect(200);

      const body = response.body as ListVehicleData;

      expect(body.data).to.be.an('array');
      expect(body.data.length).to.equal(1);

      // @ts-expect-error - data is private
      expect(body.data.map(({ props }) => props)).to.deep.include.members([
        vehicles[2],
      ]);

      expect(body.metadata).to.be.an('object');
      expect(body.metadata.page).to.equal(String(page));
      expect(body.metadata.totalPages).to.equal(2);
    });

    it('should return an error when page or pageSize is invalid', async () => {
      const invalidQueries = [
        { page: 0, pageSize: 10 },
        { page: 1, pageSize: 0 },
      ];

      for (const query of invalidQueries) {
        const response = await request(app.getHttpServer())
          .get('/vehicle')
          .query(query);

        expect(response.status).to.equal(400);

        expect(response.body.message).to.contains(
          ERROR_MESSAGES.INVALID_PAGE_OR_PAGE_SIZE(),
        );
      }
    });

    it('should return an error if page exceeds the maximum', async () => {
      const page = 3;
      const pageSize = 2;
      const maxPage = Math.ceil(vehicles.length / pageSize);

      const response = await request(app.getHttpServer())
        .get('/vehicle')
        .query({ page, pageSize })
        .expect(400);

      expect(response.body.message).to.include(
        ERROR_MESSAGES.PAGE_EXCEEDS_MAX(page, maxPage),
      );
    });
  });
});
