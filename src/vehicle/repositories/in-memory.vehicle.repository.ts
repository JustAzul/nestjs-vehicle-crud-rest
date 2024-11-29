import { randomUUID, UUID } from 'crypto';
import { Vehicle, VehicleProps } from '../entities/vehicle.entity';
import { IVehicleRepository } from './interfaces/vehicle.repository';

export class InMemoryRepository implements IVehicleRepository {
  private readonly vehicles: Map<UUID, Vehicle> = new Map();

  // Create a new vehicle
  create(vehicle: Omit<Vehicle, 'id'>): Vehicle {
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
    const existingVehicle = this.vehicles.get(id);
    if (!existingVehicle) return null;

    const props: VehicleProps = {
      ...existingVehicle,
      ...updatedData,
    };

    const updatedVehicle = new Vehicle(props);
    this.vehicles.set(id, updatedVehicle);
    return updatedVehicle;
  }

  // Delete a vehicle by ID
  delete(id: UUID): boolean {
    return this.vehicles.delete(id);
  }
}
