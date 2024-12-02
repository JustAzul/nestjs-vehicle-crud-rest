import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleDataDto } from './create-vehicle-data.dto';

export class UpdatedVehicleDataDto extends PartialType(CreateVehicleDataDto) {}
