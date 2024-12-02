import { VehicleData } from './dto/list-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';

export abstract class VehicleMapper {
  static toDTO(entity: Vehicle): VehicleData {
    return {
      id: entity.id,
      plate: entity.plate,
      chassis: entity.chassis,
      renavam: entity.renavam,
      model: entity.model,
      brand: entity.brand,
      year: entity.year,
    };
  }

  static toDTOList(entities: Vehicle[]): VehicleData[] {
    return entities.map((entity) => this.toDTO(entity));
  }
}
