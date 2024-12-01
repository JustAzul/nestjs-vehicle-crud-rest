import { Module } from '@nestjs/common';

import { VehicleController } from './vehicle.controller';
import { IVehicleRepository } from './repositories/interfaces/vehicle.repository';
import { InMemoryVehicleRepository } from './repositories/in-memory.vehicle.repository';
import { VEHICLE_UNIQUE_FIELDS } from './constants/module.contants';

@Module({
  controllers: [VehicleController],
  providers: [
    {
      provide: IVehicleRepository,
      useFactory: () => {
        return new InMemoryVehicleRepository(new Map(), VEHICLE_UNIQUE_FIELDS);
      },
    },
  ],
})
export class VehicleModule {}
