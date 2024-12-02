import { Vehicle } from '../entities/vehicle.entity';

export const VEHICLE_UNIQUE_FIELDS: (keyof Vehicle)[] = [
  'chassis',
  'plate',
  'renavam',
];

export const DEFAULT_PAGE_SIZE = 10;
