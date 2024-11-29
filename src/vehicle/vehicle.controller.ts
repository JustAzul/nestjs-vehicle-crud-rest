import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotImplementedException,
} from '@nestjs/common';

@Controller('vehicle')
export class VehicleController {
  // GET /vehicle - List all vehicles
  @Get()
  getAllVehicles() {
    throw new NotImplementedException('Method not implemented');
  }

  // GET /vehicle/:id - Get a specific vehicle by ID
  @Get(':id')
  getVehicleById(@Param('id') id: string) {
    throw new NotImplementedException('Method not implemented');
  }

  // POST /vehicle - Create a new vehicle
  @Post()
  createVehicle(@Body() vehicleData: any) {
    throw new NotImplementedException('Method not implemented');
  }

  // PUT /vehicle/:id - Update a specific vehicle by ID
  @Put(':id')
  updateVehicle(@Param('id') id: string, @Body() updatedVehicleData: any) {
    throw new NotImplementedException('Method not implemented');
  }

  // DELETE /vehicle/:id - Delete a specific vehicle by ID
  @Delete(':id')
  deleteVehicle(@Param('id') id: string) {
    throw new NotImplementedException('Method not implemented');
  }
}
