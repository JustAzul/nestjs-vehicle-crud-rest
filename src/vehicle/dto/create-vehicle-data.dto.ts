import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class CreateVehicleDataDto {
  @ApiProperty({
    description: 'License plate of the vehicle',
    maxLength: 10,
    example: 'ABC-1234',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  plate: string;

  @ApiProperty({
    description: 'Chassis number of the vehicle',
    example: '1HGBH41JXMN109186',
  })
  @IsNotEmpty()
  @IsString()
  chassis: string;

  @ApiProperty({
    description: 'RENAVAM (vehicle registry number)',
    example: '1234567890',
  })
  @IsNotEmpty()
  @IsString()
  renavam: string;

  @ApiProperty({
    description: 'Model of the vehicle',
    example: 'Civic',
  })
  @IsNotEmpty()
  @IsString()
  model: string;

  @ApiProperty({
    description: 'Brand of the vehicle',
    example: 'Honda',
  })
  @IsNotEmpty()
  @IsString()
  brand: string;

  @ApiProperty({
    description: 'Manufacturing year of the vehicle',
    example: 2022,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1886) // The first car was invented in 1886
  @Max(new Date().getFullYear() + 1) // Cannot be in the future
  year: number;
}
