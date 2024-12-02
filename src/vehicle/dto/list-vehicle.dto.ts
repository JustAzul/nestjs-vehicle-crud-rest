import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'crypto';

export class VehicleData {
  @ApiProperty({
    description: 'Vehicle ID.',
  })
  id: UUID;

  @ApiProperty({
    description: 'Vehicle plate.',
  })
  plate: string;

  @ApiProperty({
    description: 'Vehicle chassis.',
  })
  chassis: string;

  @ApiProperty({
    description: 'Vehicle renavam.',
  })
  renavam: string;

  @ApiProperty({
    description: 'Vehicle model.',
  })
  model: string;

  @ApiProperty({
    description: 'Vehicle brand.',
  })
  brand: string;

  @ApiProperty({
    description: 'Vehicle year.',
  })
  year: number;
}

class Metadata {
  @ApiProperty({
    description: 'Total number of pages',
  })
  totalPages: number;

  @ApiProperty({
    description: 'Page number',
  })
  page: number;
}

export class ListVehicleData {
  @ApiProperty({
    description: 'Array of vehicle data.',
    type: [VehicleData],
  })
  data: VehicleData[];

  @ApiProperty({
    description: 'Pagination metadata.',
  })
  metadata: Metadata;
}
