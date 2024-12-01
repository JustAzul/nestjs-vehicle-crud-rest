import { UUID } from 'crypto';
import { Vehicle, VehicleProps } from '../entities/vehicle.entity';
import {
  IVehicleRepository,
  PaginatedVehicleResult,
} from './interfaces/vehicle.repository';

export class InMemoryVehicleRepository implements IVehicleRepository {
  constructor(
    private readonly vehicles: Map<UUID, Vehicle>,
    private readonly uniqueFields: (keyof Vehicle)[],
  ) {
    this.vehicles = vehicles;
  }

  // Create a new vehicle
  async create({
    entity,
  }: Parameters<IVehicleRepository[`create`]>[0]): Promise<Vehicle> {
    const duplicateField = this.checkDuplicate({
      entity,
    });

    if (duplicateField) {
      throw new Error(`Vehicle with the same ${duplicateField} already exists`);
    }

    const newVehicle: Vehicle = new Vehicle(entity);
    const id = newVehicle.id;
    this.vehicles.set(id, newVehicle);
    return newVehicle;
  }

  // Retrieve all vehicles with pagination
  async findAll({
    page,
    pageSize,
  }: Parameters<
    IVehicleRepository[`findAll`]
  >[0]): Promise<PaginatedVehicleResult> {
    if ((page && page < 1) || (pageSize && pageSize < 1)) {
      throw new Error('Page and pageSize must be positive integers');
    }

    const allVehicles = Array.from(this.vehicles.values());
    const totalItems = allVehicles.length;
    const maxPage = Math.ceil(totalItems / pageSize);

    if (page > maxPage) {
      throw new Error(`Page ${page} exceeds maximum page number ${maxPage}`);
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const result = allVehicles.slice(startIndex, endIndex);

    return {
      data: result,
      metadata: {
        page,
        totalPages: maxPage,
      },
    };
  }

  // Retrieve a vehicle by ID
  async findById({
    id,
  }: Parameters<IVehicleRepository[`findById`]>[0]): Promise<Vehicle | null> {
    return this.vehicles.get(id) || null;
  }

  // Update a vehicle by ID
  async update({
    id,
    updatedData,
  }: Parameters<IVehicleRepository[`update`]>[0]): Promise<Vehicle | null> {
    const existingVehicle = await this.findById({ id });
    if (!existingVehicle) return null;

    const props: VehicleProps = {
      brand: updatedData.brand || existingVehicle.brand,
      chassis: updatedData.chassis || existingVehicle.chassis,
      model: updatedData.model || existingVehicle.model,
      plate: updatedData.plate || existingVehicle.plate,
      renavam: updatedData.renavam || existingVehicle.renavam,
      year: updatedData.year || existingVehicle.year,
    };

    const duplicateField = this.checkDuplicate({
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
  async delete({
    id,
  }: Parameters<IVehicleRepository[`delete`]>[0]): Promise<boolean> {
    return this.vehicles.delete(id);
  }

  checkDuplicate({
    entity,
    excludeId,
  }: {
    entity: Partial<Vehicle>;
    excludeId?: UUID;
  }): keyof Vehicle | null {
    for (const [id, existingEntity] of this.vehicles.entries()) {
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
