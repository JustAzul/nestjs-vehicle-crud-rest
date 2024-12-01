import { Vehicle } from '../entities/vehicle.entity';

export const VEHICLE_UNIQUE_FIELDS: (keyof Vehicle)[] = [
  'chassis',
  'plate',
  'renavam',
];

export const ERROR_MESSAGES = {
  DUPLICATE_VEHICLE: (field: string) =>
    `Vehicle with the same ${field} already exists`,
  INVALID_PAGE_OR_PAGE_SIZE: () =>
    'Page and pageSize must be positive integers',
  PAGE_EXCEEDS_MAX: (page: number, maxPage: number) =>
    `Page ${page} exceeds maximum page number ${maxPage}`,
};
