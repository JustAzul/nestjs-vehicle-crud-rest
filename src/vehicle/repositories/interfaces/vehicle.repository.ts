import { UUID } from 'crypto';
import { Vehicle } from '../../entities/vehicle.entity';

export abstract class IVehicleRepository {
  // Create a new vehicle
  abstract create(params: { entity: Omit<Vehicle, 'id'> }): Promise<Vehicle>;

  // Retrieve all vehicles
  abstract findAll(params: {
    page?: number;
    pageSize?: number;
  }): Promise<Vehicle[]>;

  // Retrieve a vehicle by ID
  abstract findById(params: { id: UUID }): Promise<Vehicle | null>;

  // Update a vehicle by ID
  abstract update(params: {
    id: UUID;
    updatedData: Partial<Omit<Vehicle, 'id'>>;
  }): Promise<Vehicle | null>;

  // Delete a vehicle by ID
  abstract delete(params: { id: UUID }): Promise<boolean>;
}
