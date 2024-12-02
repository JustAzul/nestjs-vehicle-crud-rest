import { UUID } from 'crypto';
import { Vehicle, VehicleProps } from '../entities/vehicle.entity';
import {
  IVehicleRepository,
  PaginatedVehicleResult,
} from './interfaces/vehicle.repository';
import { AppError } from '@src/app.error';
import { ERROR_MESSAGES, ErrorCodes } from '../constants/errors.constants';

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
      throw new AppError(
        ErrorCodes.DUPLICATE_VEHICLE,
        ERROR_MESSAGES.DUPLICATE_VEHICLE(duplicateField),
      );
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
      throw new AppError(
        ErrorCodes.INVALID_PAGE_OR_PAGE_SIZE,
        ERROR_MESSAGES.INVALID_PAGE_OR_PAGE_SIZE(),
      );
    }

    const allVehicles = Array.from(this.vehicles.values());
    const totalItems = allVehicles.length;
    const maxPage = Math.ceil(totalItems / pageSize);

    if (page > maxPage) {
      throw new AppError(
        ErrorCodes.PAGE_EXCEEDS_MAX,
        ERROR_MESSAGES.PAGE_EXCEEDS_MAX(page, maxPage),
      );
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

    if (!existingVehicle) {
      throw new AppError(
        ErrorCodes.VEHICLE_NOT_FOUND,
        ERROR_MESSAGES.VEHICLE_NOT_FOUND(id),
      );
    }

    const duplicateField = this.checkDuplicate({
      entity: updatedData,
      excludeId: id,
    });

    if (duplicateField) {
      throw new AppError(
        ErrorCodes.DUPLICATE_VEHICLE,
        ERROR_MESSAGES.DUPLICATE_VEHICLE(duplicateField),
      );
    }

    const updatedVehicle = new Vehicle({
      brand: existingVehicle.brand,
      chassis: existingVehicle.chassis,
      model: existingVehicle.model,
      plate: existingVehicle.plate,
      renavam: existingVehicle.renavam,
      year: existingVehicle.year,
      id,
      ...updatedData,
    });

    this.vehicles.set(id, updatedVehicle);
    return updatedVehicle;
  }

  // Delete a vehicle by ID
  async delete({
    id,
  }: Parameters<IVehicleRepository[`delete`]>[0]): Promise<boolean> {
    const entityExists = this.vehicles.has(id);

    if (entityExists) {
      const hasDeleted = this.vehicles.delete(id);
      return hasDeleted;
    }

    throw new AppError(
      ErrorCodes.VEHICLE_NOT_FOUND,
      ERROR_MESSAGES.VEHICLE_NOT_FOUND(id),
    );
  }

  private checkDuplicate({
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
