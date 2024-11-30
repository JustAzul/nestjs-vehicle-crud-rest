import { UUID } from 'crypto';
import { Vehicle } from '../../entities/vehicle.entity';

export abstract class IVehicleRepository {
  // Create a new vehicle
  abstract create(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle>;

  // Retrieve all vehicles
  abstract findAll(): Promise<Vehicle[]>;

  // Retrieve a vehicle by ID
  abstract findById(id: UUID): Promise<Vehicle | null>;

  // Update a vehicle by ID
  abstract update(
    id: UUID,
    updatedData: Partial<Omit<Vehicle, 'id'>>,
  ): Promise<Vehicle | null>;

  // Delete a vehicle by ID
  abstract delete(id: UUID): Promise<boolean>;
}
