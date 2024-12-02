import { VehicleDataDto } from './dto/vehicle-data.dto';
import { Vehicle } from './entities/vehicle.entity';

export class VehicleMapper {
  static toDTO(entity: Vehicle): VehicleDataDto {
    return {
      plate: entity.plate,
      chassis: entity.chassis,
      renavam: entity.renavam,
      model: entity.model,
      brand: entity.brand,
      year: entity.year,
    };
  }

  static toDTOList(entities: Vehicle[]): VehicleDataDto[] {
    return entities.map((entity) => this.toDTO(entity));
  }
}
