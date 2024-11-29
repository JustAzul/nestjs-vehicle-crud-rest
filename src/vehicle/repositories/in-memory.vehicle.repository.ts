import { UUID } from 'crypto';
import { Vehicle, VehicleProps } from '../entities/vehicle.entity';
import { IVehicleRepository } from './interfaces/vehicle.repository';

export class InMemoryRepository implements IVehicleRepository {
  private readonly vehicles: Map<UUID, Vehicle> = new Map();

  // Create a new vehicle
  create(vehicle: Omit<Vehicle, 'id'>): Vehicle {
    const duplicateField = UniqueFieldValidator.checkDuplicate(
      this.vehicles,
      vehicle,
    );

    if (duplicateField) {
      throw new Error(`Vehicle with the same ${duplicateField} already exists`);
    }

    const newVehicle: Vehicle = new Vehicle(vehicle);
    const id = newVehicle.id;
    this.vehicles.set(id, newVehicle);
    return newVehicle;
  }

  // Retrieve all vehicles
  findAll(): Vehicle[] {
    return Array.from(this.vehicles.values());
  }

  // Retrieve a vehicle by ID
  findById(id: UUID): Vehicle | null {
    return this.vehicles.get(id) || null;
  }

  // Update a vehicle by ID
  update(id: UUID, updatedData: Partial<Omit<Vehicle, 'id'>>): Vehicle | null {
    const existingVehicle = this.findById(id);
    if (!existingVehicle) return null;

    const props: VehicleProps = {
      brand: updatedData.brand || existingVehicle.brand,
      chassis: updatedData.chassis || existingVehicle.chassis,
      model: updatedData.model || existingVehicle.model,
      plate: updatedData.plate || existingVehicle.plate,
      renavam: updatedData.renavam || existingVehicle.renavam,
      year: updatedData.year || existingVehicle.year,
    };

    const duplicateField = UniqueFieldValidator.checkDuplicate(
      this.vehicles,
      props,
      id,
    );

    if (duplicateField) {
      throw new Error(`Vehicle with the same ${duplicateField} already exists`);
    }

    const updatedVehicle = new Vehicle(props);
    this.vehicles.set(id, updatedVehicle);
    return updatedVehicle;
  }

  // Delete a vehicle by ID
  delete(id: UUID): boolean {
    return this.vehicles.delete(id);
  }
}

class UniqueFieldValidator {
  static checkDuplicate(
    vehicles: Map<UUID, Vehicle>,
    vehicle: Partial<Vehicle>,
    uniqueFields: (keyof Vehicle)[],
    excludeId?: UUID,
  ): string | null {
    for (const [id, existingVehicle] of vehicles.entries()) {
      if (id === excludeId) continue; // Skip the vehicle being updated

      for (const field of uniqueFields) {
        if (vehicle[field] && vehicle[field] === existingVehicle[field]) {
          return field; // Return the first duplicate field found
        }
      }
    }

    return null; // No duplicates found
  }
}
