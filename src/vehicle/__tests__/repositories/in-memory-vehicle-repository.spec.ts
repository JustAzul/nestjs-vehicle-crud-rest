import { expect } from 'chai';
import { Vehicle, VehicleProps } from 'src/vehicle/entities/vehicle.entity';
import { InMemoryVehicleRepository } from 'src/vehicle/repositories/in-memory.vehicle.repository';
import { randomUUID, UUID } from 'crypto';
import { IVehicleRepository } from 'src/vehicle/repositories/interfaces/vehicle.repository';
import { VEHICLE_UNIQUE_FIELDS } from '@src/vehicle/constants/module.contants';
import {
  ERROR_MESSAGES,
  ErrorCodes,
} from '@src/vehicle/constants/errors.constants';
import { AppError } from '@src/utils/app.error';

describe(InMemoryVehicleRepository.name, () => {
  let repository: IVehicleRepository;
  let repositorySourceData: Map<UUID, Vehicle>;

  beforeEach(() => {
    repositorySourceData = new Map();
    repository = new InMemoryVehicleRepository(
      repositorySourceData,
      VEHICLE_UNIQUE_FIELDS,
    );
  });

  it('should create a new vehicle', async () => {
    const vehicleData: VehicleProps = {
      brand: 'Toyota',
      chassis: 'ABC123',
      model: 'Corolla',
      plate: 'XYZ1234',
      renavam: '567890',
      year: 2020,
    };

    const vehicle = await repository.create({ entity: vehicleData });
    const storedVehicle = repositorySourceData.get(vehicle.id);

    expect(storedVehicle).to.deep.include(vehicleData);
  });

  describe('should not create a vehicle with duplicate unique fields', () => {
    it('should fail to create a vehicle with duplicate fields', async () => {
      const vehicleData: VehicleProps = {
        brand: 'Toyota',
        chassis: 'ABC123',
        model: 'Corolla',
        plate: 'XYZ1234',
        renavam: '567890',
        year: 2020,
      };

      await repository.create({ entity: vehicleData });

      try {
        const result = await repository.create({ entity: vehicleData });
        expect(result).to.be.null;
      } catch (e: unknown) {
        expect(e).to.be.instanceOf(Error);
      }
    });

    it('should throw the correct error for duplicate fields', async () => {
      const vehicleData: VehicleProps = {
        brand: 'Toyota',
        chassis: 'ABC123',
        model: 'Corolla',
        plate: 'XYZ1234',
        renavam: '567890',
        year: 2020,
      };

      await repository.create({ entity: vehicleData });

      try {
        await repository.create({ entity: vehicleData });
      } catch (error: unknown) {
        expect(error).to.be.instanceOf(AppError);

        const appError = error as AppError;
        expect(appError.id).to.equal(ErrorCodes.DUPLICATE_VEHICLE);

        expect(appError.message).to.contains(
          ERROR_MESSAGES.DUPLICATE_VEHICLE('chassis'),
        );
      }
    });
  });

  describe('pagination behavior', () => {
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
        await repository.create({ entity: vehicle });
      }
    });

    it('should retrieve all vehicles with pagination', async () => {
      const page1 = await repository.findAll({ page: 1, pageSize: 2 });
      const page2 = await repository.findAll({ page: 2, pageSize: 2 });

      expect(page1.data.length).to.equal(2);
      expect(page2.data.length).to.equal(1);

      //@ts-expect-error - data is private
      const page1Props = page1.data.map(({ props }) => props);

      //@ts-expect-error - data is private
      const page2Props = page2.data.map(({ props }) => props);

      expect(page1Props).to.deep.include(vehicles[0]);
      expect(page1Props).to.deep.include(vehicles[1]);
      expect(page2Props).to.deep.include(vehicles[2]);
    });

    it('should throw an error for invalid pagination', async () => {
      const invalidQueries = [
        { page: 0, pageSize: 10 },
        { page: 1, pageSize: 0 },
      ];

      for (const query of invalidQueries) {
        try {
          await repository.findAll(query);
        } catch (error: unknown) {
          expect(error).to.be.instanceOf(AppError);

          const appError = error as AppError;
          expect(appError.id).to.equal(ErrorCodes.INVALID_PAGE_OR_PAGE_SIZE);

          expect(appError.message).to.contains(
            ERROR_MESSAGES.INVALID_PAGE_OR_PAGE_SIZE(),
          );
        }
      }
    });

    it('should throw an error if requested page exceeds maximum page number', async () => {
      const vehicleData: VehicleProps = {
        brand: 'Toyota',
        chassis: 'ABC123',
        model: 'Corolla',
        plate: 'XYZ1234',
        renavam: '567890',
        year: 2020,
      };

      await repository.create({ entity: vehicleData });

      try {
        await repository.findAll({ page: 2, pageSize: 1 });
      } catch (error: unknown) {
        expect(error).to.be.instanceOf(AppError);

        const appError = error as AppError;
        expect(appError.id).to.equal(ErrorCodes.PAGE_EXCEEDS_MAX);

        expect(appError.message).to.contains(
          ERROR_MESSAGES.PAGE_EXCEEDS_MAX(2, 1),
        );
      }
    });
  });

  it('should retrieve a vehicle by ID', async () => {
    const vehicleData: VehicleProps = {
      brand: 'Toyota',
      chassis: 'ABC123',
      model: 'Corolla',
      plate: 'XYZ1234',
      renavam: '567890',
      year: 2020,
    };

    const vehicle = await repository.create({ entity: vehicleData });
    const storedVehicle = await repository.findById({ id: vehicle.id });

    expect(storedVehicle).to.deep.include(vehicleData);
  });

  {
    const initialVehicleData: VehicleProps = {
      brand: 'Toyota',
      chassis: 'ABC123',
      model: 'Corolla',
      plate: 'XYZ1234',
      renavam: '567890',
      year: 2020,
    };

    const testUpdateField = async (
      field: keyof VehicleProps,
      newValue: string | number,
    ) => {
      const vehicle = await repository.create({ entity: initialVehicleData });
      const updatedData = { [field]: newValue };

      const updatedVehicle = await repository.update({
        id: vehicle.id,
        updatedData,
      });

      expect(updatedVehicle?.[field]).to.equal(newValue);
      expect(repositorySourceData.get(vehicle.id)?.[field]).to.equal(newValue);
    };

    it('should update the brand', async () => {
      await testUpdateField('brand', 'UpdatedBrand');
    });

    it('should update the chassis', async () => {
      await testUpdateField('chassis', 'UpdatedChassis');
    });

    it('should update the model', async () => {
      await testUpdateField('model', 'UpdatedModel');
    });

    it('should update the plate', async () => {
      await testUpdateField('plate', 'UpdatedPlate');
    });

    it('should update the renavam', async () => {
      await testUpdateField('renavam', 'UpdatedRenavam');
    });

    it('should update the year', async () => {
      await testUpdateField('year', 2021);
    });
  }

  describe('should not update a vehicle with duplicate unique fields', () => {
    const vehicle1 = {
      brand: 'Toyota',
      chassis: 'ABC123',
      model: 'Corolla',
      plate: 'XYZ1234',
      renavam: '567890',
      year: 2020,
    };
    const vehicle2 = {
      brand: 'Honda',
      chassis: 'DEF456',
      model: 'Civic',
      plate: 'XYZ5678',
      renavam: '123456',
      year: 2021,
    };

    it('should fail to update a vehicle with duplicate fields', async () => {
      const createdVehicle1 = await repository.create({ entity: vehicle1 });
      const createdVehicle2 = await repository.create({ entity: vehicle2 });

      const uniqueFields: (keyof Vehicle)[] = VEHICLE_UNIQUE_FIELDS;

      for (const uniqueField of uniqueFields) {
        const updatedData = { [uniqueField]: vehicle1[uniqueField] };

        try {
          const result = await repository.update({
            id: createdVehicle2.id,
            updatedData,
          });

          expect(result).to.be.null;
        } catch (e: unknown) {
          expect(e).to.be.instanceOf(Error);
        }
      }
    });

    it('should throw the correct error for duplicate update fields', async () => {
      const createdVehicle1 = await repository.create({ entity: vehicle1 });
      const createdVehicle2 = await repository.create({ entity: vehicle2 });

      const uniqueFields: (keyof Vehicle)[] = VEHICLE_UNIQUE_FIELDS;

      for (const uniqueField of uniqueFields) {
        try {
          await repository.update({
            id: createdVehicle2.id,
            updatedData: { [uniqueField]: vehicle1[uniqueField] },
          });
        } catch (error: unknown) {
          expect(error).to.be.instanceOf(AppError);

          const appError = error as AppError;
          expect(appError.id).to.equal(ErrorCodes.DUPLICATE_VEHICLE);

          expect(appError.message).to.contains(
            ERROR_MESSAGES.DUPLICATE_VEHICLE(uniqueField),
          );
        }
      }
    });
  });

  it('should delete a vehicle by ID', async () => {
    const vehicleData: VehicleProps = {
      brand: 'Toyota',
      chassis: 'ABC123',
      model: 'Corolla',
      plate: 'XYZ1234',
      renavam: '567890',
      year: 2020,
    };

    const vehicle = await repository.create({ entity: vehicleData });
    const deleted = await repository.delete({ id: vehicle.id });

    expect(deleted).to.be.true;
    expect(repositorySourceData.has(vehicle.id)).to.be.false;
  });

  it('should return false when deleting a non-existent vehicle', async () => {
    const nonExistentId = randomUUID();
    const deleted = await repository.delete({ id: nonExistentId });

    expect(deleted).to.be.false;
  });

  it('should return null when finding a vehicle by non-existent ID', async () => {
    const nonExistentId = randomUUID();
    const vehicle = await repository.findById({ id: nonExistentId });

    expect(vehicle).to.be.null;
  });

  it('should return null when updating a non-existent vehicle', async () => {
    const nonExistentId = randomUUID();
    const updatedVehicle = await repository.update({
      id: nonExistentId,
      updatedData: { brand: 'UpdatedBrand' },
    });

    expect(updatedVehicle).to.be.null;
  });
});
