import { Module } from '@nestjs/common';

import { VehicleController } from './vehicle.controller';
import { IVehicleRepository } from './repositories/interfaces/vehicle.repository';
import { InMemoryVehicleRepository } from './repositories/in-memory.vehicle.repository';

@Module({
  controllers: [VehicleController],
  providers: [
    {
      provide: IVehicleRepository,
      useFactory: () => {
        return new InMemoryVehicleRepository(new Map(), [
          'chassis',
          'plate',
          'renavam',
        ]);
      },
    },
  ],
})
export class VehicleModule {}
