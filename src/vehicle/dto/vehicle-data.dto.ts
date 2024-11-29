import {
  IsNotEmpty,
  IsString,
  IsInt,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class VehicleDataDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  plate: string;

  @IsNotEmpty()
  @IsString()
  chassis: string;

  @IsNotEmpty()
  @IsString()
  renavam: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1886) // The first car was invented in 1886
  @Max(new Date().getFullYear() + 1) // Cannot be in the future
  year: number;
}
