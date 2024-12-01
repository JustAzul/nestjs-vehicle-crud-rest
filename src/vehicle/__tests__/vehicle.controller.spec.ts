import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { randomUUID, UUID } from 'crypto';
import { expect } from 'chai';
import { InMemoryVehicleRepository } from '../repositories/in-memory.vehicle.repository';
import { IVehicleRepository } from '../repositories/interfaces/vehicle.repository';
import { VehicleModule } from '../vehicle.module';
import { VEHICLE_UNIQUE_FIELDS } from '../constants/module.contants';
import { Vehicle, VehicleProps } from '../entities/vehicle.entity';
import { ListVehicleData } from '../dto/list-vehicle.dto';

describe('VehicleController (e2e)', () => {
  let repositorySourceData: Map<UUID, Vehicle>;
  let app: INestApplication;
  let repository: IVehicleRepository;

  before(async () => {
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
  });

  after(async () => {
    await app.close();
  });

  describe('GET /vehicle', () => {
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

    beforeEach(async () => {
      for (const vehicle of vehicles) {
        await repository.create({
          entity: vehicle,
        });
      }
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

      expect(body.metadata).to.be.an('object');
      expect(body.metadata.page).to.equal(String(page));
      expect(body.metadata.totalPages).to.equal(2);
    });
  });
});
