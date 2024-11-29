import { PartialType } from '@nestjs/mapped-types';
import { VehicleDataDto } from './vehicle-data.dto';

export class UpdatedVehicleDataDto extends PartialType(VehicleDataDto) {}
