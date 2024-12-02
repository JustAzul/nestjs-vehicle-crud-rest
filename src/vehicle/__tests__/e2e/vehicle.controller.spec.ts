import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { randomUUID, UUID } from 'crypto';
import { expect } from 'chai';
import { InMemoryVehicleRepository } from '../../repositories/in-memory.vehicle.repository';
import { IVehicleRepository } from '../../repositories/interfaces/vehicle.repository';
import { VehicleModule } from '../../vehicle.module';
import {
  DEFAULT_PAGE_SIZE,
  VEHICLE_UNIQUE_FIELDS,
} from '../../constants/module.contants';
import { Vehicle, VehicleProps } from '../../entities/vehicle.entity';
import { ListVehicleData, VehicleData } from '../../dto/list-vehicle.dto';
import { VehicleController } from '../../vehicle.controller';
import { ERROR_MESSAGES } from '../../constants/errors.constants';
import { VehicleMapper } from '@src/vehicle/vehicle.mapper';

describe(`${VehicleController.name} (E2E)`, () => {
  let repositorySourceData: Map<UUID, Vehicle>;
  let app: INestApplication;
  let repository: IVehicleRepository;

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
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /vehicle', () => {
    it('should create a new vehicle', async () => {
      const vehicleData: VehicleProps = {
        brand: 'Toyota',
        chassis: '123',
        model: 'Corolla',
        plate: 'XYZ123',
        renavam: '5678',
        year: 2020,
      };

      const response = await request(app.getHttpServer())
        .post('/vehicle')
        .send(vehicleData);

      expect(response.status).to.equal(HttpStatus.CREATED);

      const createdVehicle = response.body as VehicleData;
      expect(createdVehicle).to.deep.contains(vehicleData);

      const storedVehicle = await repository.findById({
        id: createdVehicle.id,
      });

      expect(storedVehicle).to.deep.contains(vehicleData);
    });

    it('should return an error when vehicle already exists', async () => {
      const vehicleData: VehicleProps = {
        brand: 'Toyota',
        chassis: '123',
        model: 'Corolla',
        plate: 'XYZ123',
        renavam: '5678',
        year: 2020,
      };

      await repository.create({ entity: vehicleData });

      for (const uniqueField of VEHICLE_UNIQUE_FIELDS) {
        const response = await request(app.getHttpServer())
          .post('/vehicle')
          .send({
            brand: 'Honda',
            chassis: 'DEF456',
            model: 'Civic',
            plate: 'XYZ5678',
            renavam: '123456',
            year: 2021,
            [uniqueField]: vehicleData[uniqueField],
          });

        expect(response.status).to.equal(HttpStatus.CONFLICT);

        expect(response.body.message).to.include(
          ERROR_MESSAGES.DUPLICATE_VEHICLE(uniqueField),
        );
      }
    });
  });

  describe('PUT /vehicle/:id', () => {
    it('should update a vehicle by ID', async () => {
      const vehicle = await repository.create({
        entity: {
          brand: 'Toyota',
          chassis: '123',
          model: 'Corolla',
          plate: 'XYZ123',
          renavam: '5678',
          year: 2020,
        },
      });

      const updatedData: VehicleProps = {
        brand: 'Honda',
        chassis: 'DEF456',
        model: 'Civic',
        plate: 'XYZ5678',
        renavam: '123456',
        year: 2021,
      };

      const response = await request(app.getHttpServer())
        .put(`/vehicle/${vehicle.id}`)
        .send(updatedData);

      expect(response.status).to.equal(HttpStatus.OK);

      const updatedVehicle = response.body as VehicleData;
      expect(updatedVehicle).to.deep.contains(updatedData);

      const storedVehicle = await repository.findById({ id: vehicle.id });
      expect(storedVehicle).to.deep.contains(updatedData);
    });

    it('should return an error when vehicle is not found', async () => {
      const id = randomUUID();

      const response = await request(app.getHttpServer())
        .put(`/vehicle/${id}`)
        .send({
          brand: 'Honda',
          chassis: 'DEF456',
          model: 'Civic',
          plate: 'XYZ5678',
          renavam: '123456',
          year: 2021,
        });

      expect(response.status).to.equal(HttpStatus.NOT_FOUND);

      expect(response.body.message).to.include(
        ERROR_MESSAGES.VEHICLE_NOT_FOUND(id),
      );
    });

    it.skip('should return an error when vehicle already exists', async () => {
      const vehicle = await repository.create({
        entity: {
          brand: 'Toyota',
          chassis: '123',
          model: 'Corolla',
          plate: 'XYZ123',
          renavam: '5678',
          year: 2020,
        },
      });

      for (const uniqueField of VEHICLE_UNIQUE_FIELDS) {
        const response = await request(app.getHttpServer())
          .put(`/vehicle/${vehicle.id}`)
          .send({
            brand: 'Honda',
            chassis: 'DEF456',
            model: 'Civic',
            plate: 'XYZ5678',
            renavam: '123456',
            year: 2021,
            [uniqueField]: vehicle[uniqueField],
          });
      }
    });
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
      repository = app.get<IVehicleRepository>(IVehicleRepository);

      for (const vehicle of vehicles) {
        await repository.create({ entity: vehicle });
      }
    });

    it('should return the first page of vehicles', async () => {
      const page = 1;
      const pageSize = 2;

      const response = await request(app.getHttpServer())
        .get('/vehicle')
        .query({ page, pageSize });

      expect(response.status).to.equal(HttpStatus.OK);

      const body = response.body as ListVehicleData;

      expect(body.data).to.be.an('array');
      expect(body.data.length).to.equal(2);

      expect(body.data).to.deep.include.members([vehicles[0], vehicles[1]]);

      expect(body.metadata).to.be.an('object');
      expect(body.metadata.page).to.equal(String(page));
      expect(body.metadata.totalPages).to.equal(2);
    });

    it('should return the second page of vehicles', async () => {
      const page = 2;
      const pageSize = 2;

      const response = await request(app.getHttpServer())
        .get('/vehicle')
        .query({ page, pageSize });

      expect(response.status).to.equal(HttpStatus.OK);

      const body = response.body as ListVehicleData;

      expect(body.data).to.be.an('array');
      expect(body.data.length).to.equal(1);

      expect(body.data).to.deep.include.members([vehicles[2]]);

      expect(body.metadata).to.be.an('object');
      expect(body.metadata.page).to.equal(String(page));
      expect(body.metadata.totalPages).to.equal(2);
    });

    it(`should return first page results when no query is provided`, async () => {
      const itemsPerPage = Math.min(vehicles.length, DEFAULT_PAGE_SIZE);
      const totalPages = Math.ceil(vehicles.length / DEFAULT_PAGE_SIZE);

      const response = await request(app.getHttpServer()).get('/vehicle');
      expect(response.status).to.equal(HttpStatus.OK);

      const body = response.body as ListVehicleData;

      expect(body.data).to.be.an('array');
      expect(body.data.length).to.equal(itemsPerPage);

      expect(body.data).to.deep.include.members([vehicles[0], vehicles[1]]);

      expect(body.metadata).to.be.an('object');
      expect(body.metadata.page).to.equal(1);
      expect(body.metadata.totalPages).to.equal(totalPages);
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

        expect(response.status).to.equal(HttpStatus.BAD_REQUEST);

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
        .query({ page, pageSize });

      expect(response.status).to.equal(HttpStatus.BAD_REQUEST);

      expect(response.body.message).to.include(
        ERROR_MESSAGES.PAGE_EXCEEDS_MAX(page, maxPage),
      );
    });
  });

  describe('GET /vehicle/:id', () => {
    it('should return a vehicle by ID', async () => {
      repository = app.get<IVehicleRepository>(IVehicleRepository);

      const vehicle = await repository.create({
        entity: {
          brand: 'Toyota',
          chassis: '123',
          model: 'Corolla',
          plate: 'XYZ123',
          renavam: '5678',
          year: 2020,
        },
      });

      const response = await request(app.getHttpServer()).get(
        `/vehicle/${vehicle.id}`,
      );

      expect(response.status).to.equal(HttpStatus.OK);
      expect(response.body).to.deep.contains(VehicleMapper.toDTO(vehicle));
    });

    it('should return an error when vehicle is not found', async () => {
      const id = randomUUID();

      const response = await request(app.getHttpServer()).get(`/vehicle/${id}`);
      expect(response.status).to.equal(HttpStatus.NOT_FOUND);

      expect(response.body.message).to.include(
        ERROR_MESSAGES.VEHICLE_NOT_FOUND(id),
      );
    });
  });

  describe('DELETE /vehicle/:id', () => {
    it('should delete a vehicle by ID', async () => {
      repository = app.get<IVehicleRepository>(IVehicleRepository);

      const vehicle = await repository.create({
        entity: {
          brand: 'Toyota',
          chassis: '123',
          model: 'Corolla',
          plate: 'XYZ123',
          renavam: '5678',
          year: 2020,
        },
      });

      expect(await repository.findById({ id: vehicle.id })).to.be.not.null;

      const response = await request(app.getHttpServer()).delete(
        `/vehicle/${vehicle.id}`,
      );

      expect(response.status).to.equal(HttpStatus.OK);

      const deletedVehicle = await repository.findById({ id: vehicle.id });
      expect(deletedVehicle).to.be.null;
    });

    it('should return true when vehicle is deleted', async () => {
      repository = app.get<IVehicleRepository>(IVehicleRepository);

      const vehicle = await repository.create({
        entity: {
          brand: 'Toyota',
          chassis: '123',
          model: 'Corolla',
          plate: 'XYZ123',
          renavam: '5678',
          year: 2020,
        },
      });

      expect(await repository.findById({ id: vehicle.id })).to.be.not.null;

      const response = await request(app.getHttpServer()).delete(
        `/vehicle/${vehicle.id}`,
      );

      expect(response.status).to.equal(HttpStatus.OK);

      expect(response.body).to.be.deep.equal({
        success: true,
      });
    });

    it('should return an error when vehicle is not found', async () => {
      const id = randomUUID();

      const response = await request(app.getHttpServer()).delete(
        `/vehicle/${id}`,
      );
      expect(response.status).to.equal(HttpStatus.NOT_FOUND);

      expect(response.body.message).to.include(
        ERROR_MESSAGES.VEHICLE_NOT_FOUND(id),
      );
    });
  });
});
