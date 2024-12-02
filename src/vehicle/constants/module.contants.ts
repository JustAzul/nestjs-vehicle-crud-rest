import { Vehicle } from '../entities/vehicle.entity';

export const VEHICLE_UNIQUE_FIELDS: (keyof Vehicle)[] = [
  'chassis',
  'plate',
  'renavam',
];
