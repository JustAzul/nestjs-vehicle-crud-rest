import { Module, Provider } from '@nestjs/common';

import { VehicleController } from './vehicle.controller';
import { IVehicleRepository } from './repositories/interfaces/vehicle.repository';
import { InMemoryVehicleRepository } from './repositories/in-memory.vehicle.repository';
import { VEHICLE_UNIQUE_FIELDS } from './constants/module.contants';

const VehicleRepository: Provider = {
  provide: IVehicleRepository,
  useFactory: () => {
    return new InMemoryVehicleRepository(new Map(), VEHICLE_UNIQUE_FIELDS);
  },
};

@Module({
  controllers: [VehicleController],
  providers: [VehicleRepository],
})
export class VehicleModule {}
