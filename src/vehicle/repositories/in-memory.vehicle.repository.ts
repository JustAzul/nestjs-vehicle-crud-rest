import { UUID } from 'crypto';
import { Vehicle, VehicleProps } from '../entities/vehicle.entity';
import { IVehicleRepository } from './interfaces/vehicle.repository';

export class InMemoryVehicleRepository implements IVehicleRepository {
  private readonly fieldValidator: UniqueFieldValidator<Vehicle>;

  constructor(private readonly vehicles: Map<UUID, Vehicle>) {
    this.fieldValidator = new UniqueFieldValidator<Vehicle>(
      InMemoryVehicleRepository.uniqueFields,
    );

    this.vehicles = new Map();
  }

  static readonly uniqueFields: (keyof Vehicle)[] = [
    'chassis',
    'plate',
    'renavam',
  ];

  // Create a new vehicle
  async create(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    const duplicateField = this.fieldValidator.checkDuplicate({
      entities: this.vehicles,
      entity: vehicle,
    });

    if (duplicateField) {
      throw new Error(`Vehicle with the same ${duplicateField} already exists`);
    }

    const newVehicle: Vehicle = new Vehicle(vehicle);
    const id = newVehicle.id;
    this.vehicles.set(id, newVehicle);
    return newVehicle;
  }

  // Retrieve all vehicles
  async findAll(): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values());
  }

  // Retrieve a vehicle by ID
  async findById(id: UUID): Promise<Vehicle | null> {
    return this.vehicles.get(id) || null;
  }

  // Update a vehicle by ID
  async update(
    id: UUID,
    updatedData: Partial<Omit<Vehicle, 'id'>>,
  ): Promise<Vehicle | null> {
    const existingVehicle = await this.findById(id);
    if (!existingVehicle) return null;

    const props: VehicleProps = {
      brand: updatedData.brand || existingVehicle.brand,
      chassis: updatedData.chassis || existingVehicle.chassis,
      model: updatedData.model || existingVehicle.model,
      plate: updatedData.plate || existingVehicle.plate,
      renavam: updatedData.renavam || existingVehicle.renavam,
      year: updatedData.year || existingVehicle.year,
    };

    const duplicateField = this.fieldValidator.checkDuplicate({
      entities: this.vehicles,
      entity: props,
      excludeId: id,
    });

    if (duplicateField) {
      throw new Error(`Vehicle with the same ${duplicateField} already exists`);
    }

    const updatedVehicle = new Vehicle(props);
    this.vehicles.set(id, updatedVehicle);
    return updatedVehicle;
  }

  // Delete a vehicle by ID
  async delete(id: UUID): Promise<boolean> {
    return this.vehicles.delete(id);
  }
}

class UniqueFieldValidator<T extends Vehicle> {
  constructor(private readonly uniqueFields: (keyof T)[]) {}

  checkDuplicate({
    entity,
    entities,
    excludeId,
  }: {
    entities: Map<UUID, T>;
    entity: Partial<T>;
    excludeId?: UUID;
  }): keyof T | null {
    for (const [id, existingEntity] of entities.entries()) {
      if (id === excludeId) continue; // Skip the entity being updated

      for (const field of this.uniqueFields) {
        if (entity[field] && entity[field] === existingEntity[field]) {
          return field; // Return the first duplicate field found
        }
      }
    }

    return null; // No duplicates found
  }
}
