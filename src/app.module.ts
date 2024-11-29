import { Module } from '@nestjs/common';

import { VehicleModule } from './vehicle/vehicle.module';

@Module({
  controllers: [],
  imports: [VehicleModule],
  providers: [],
})
export class AppModule {}
