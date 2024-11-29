import { UUID } from 'crypto';
import { Vehicle } from '../../entities/vehicle.entity';

export abstract class IVehicleRepository {
  // Create a new vehicle
  abstract create(vehicle: Omit<Vehicle, 'id'>): Vehicle;

  // Retrieve all vehicles
  abstract findAll(): Vehicle[];

  // Retrieve a vehicle by ID
  abstract findById(id: UUID): Vehicle | null;

  // Update a vehicle by ID
  abstract update(
    id: UUID,
    updatedData: Partial<Omit<Vehicle, 'id'>>,
  ): Vehicle | null;

  // Delete a vehicle by ID
  abstract delete(id: UUID): boolean;
}
