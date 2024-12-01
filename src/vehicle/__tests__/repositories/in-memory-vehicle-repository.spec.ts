import { expect } from 'chai';

import { VehicleProps } from 'src/vehicle/entities/vehicle.entity';
import { InMemoryVehicleRepository } from 'src/vehicle/repositories/in-memory.vehicle.repository';
import { randomUUID, UUID } from 'crypto';
import { IVehicleRepository } from 'src/vehicle/repositories/interfaces/vehicle.repository';

describe(InMemoryVehicleRepository.name, () => {
  let repository: IVehicleRepository;
  let repoDatabase: Map<UUID, any>;

  beforeEach(() => {
    repoDatabase = new Map();
    repository = new InMemoryVehicleRepository(repoDatabase);
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
    const storedVehicle = repoDatabase.get(vehicle.id);

    expect(storedVehicle).to.deep.include(vehicleData);
  });

  it('should not create a vehicle with duplicate unique fields', async () => {
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
      expect((error as Error).message.toLowerCase()).to.equal(
        'Vehicle with the same chassis already exists'.toLowerCase(),
      );
    }
  });

  it('should retrieve all vehicles with pagination', async () => {
    const vehicles = [
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

    for (const vehicle of vehicles) {
      await repository.create({ entity: vehicle });
    }

    const page1 = await repository.findAll({ page: 1, pageSize: 2 });
    const page2 = await repository.findAll({ page: 2, pageSize: 2 });

    expect(page1.length).to.equal(2);
    expect(page2.length).to.equal(1);
    expect(page1).to.deep.include.members([vehicles[0], vehicles[1]]);
    expect(page2).to.deep.include(vehicles[2]);
  });

  it('should throw an error if page or pageSize is less than 1', async () => {
    try {
      await repository.findAll({ page: 0, pageSize: 10 });
    } catch (error: unknown) {
      expect((error as Error).message).to.equal(
        'Page and pageSize must be positive integers',
      );
    }

    try {
      await repository.findAll({ page: 1, pageSize: 0 });
    } catch (error: unknown) {
      expect((error as Error).message).to.equal(
        'Page and pageSize must be positive integers',
      );
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
      expect((error as Error).message).to.equal(
        'Page 2 exceeds maximum page number 1',
      );
    }
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

  it('should update a vehicle', async () => {
    const vehicleData: VehicleProps = {
      brand: 'Toyota',
      chassis: 'ABC123',
      model: 'Corolla',
      plate: 'XYZ1234',
      renavam: '567890',
      year: 2020,
    };

    const vehicle = await repository.create({ entity: vehicleData });
    const updatedData = { brand: 'UpdatedBrand' };

    const updatedVehicle = await repository.update({
      id: vehicle.id,
      updatedData,
    });

    expect(updatedVehicle?.brand).to.equal(updatedData.brand);
    expect(repoDatabase.get(vehicle.id).brand).to.equal(updatedData.brand);
  });

  it('should not update a vehicle with duplicate unique fields', async () => {
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

    const createdVehicle1 = await repository.create({ entity: vehicle1 });
    const createdVehicle2 = await repository.create({ entity: vehicle2 });

    try {
      await repository.update({
        id: createdVehicle2.id,
        updatedData: { chassis: 'ABC123' },
      });
    } catch (error: unknown) {
      expect((error as Error).message).to.equal(
        'Vehicle with the same chassis already exists',
      );
    }
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
    expect(repoDatabase.has(vehicle.id)).to.be.false;
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
