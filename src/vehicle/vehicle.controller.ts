import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotImplementedException,
  ValidationPipe,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { VehicleDataDto } from './dto/vehicle-data.dto';
import { UpdatedVehicleDataDto } from './dto/update-vehicle-data.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('vehicles') // Group endpoints under the 'vehicles' tag
@Controller('vehicle')
export class VehicleController {
  // GET /vehicle - List all vehicles
  @Get()
  @ApiOperation({
    summary: 'Get all vehicles',
    description: 'Retrieve a list of all vehicles.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of vehicles retrieved successfully.',
  })
  getAllVehicles() {
    throw new NotImplementedException('Method not implemented');
  }

  // GET /vehicle/:id - Get a specific vehicle by ID
  @Get(':id')
  @ApiOperation({
    summary: 'Get vehicle by ID',
    description: 'Retrieve details of a specific vehicle by its ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Vehicle details retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the vehicle (UUID).',
  })
  getVehicleById(@Param('id') id: UUID) {
    throw new NotImplementedException('Method not implemented');
  }

  // POST /vehicle - Create a new vehicle
  @Post()
  @ApiOperation({
    summary: 'Create a new vehicle',
    description: 'Create a new vehicle with the provided data.',
  })
  @ApiResponse({ status: 201, description: 'Vehicle created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  createVehicle(@Body(ValidationPipe) vehicleData: VehicleDataDto) {
    throw new NotImplementedException('Method not implemented');
  }

  // PUT /vehicle/:id - Update a specific vehicle by ID
  @Put(':id')
  @ApiOperation({
    summary: 'Update a vehicle',
    description: 'Update details of an existing vehicle by its ID.',
  })
  @ApiResponse({ status: 200, description: 'Vehicle updated successfully.' })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the vehicle (UUID).',
  })
  updateVehicle(
    @Param('id') id: UUID,
    @Body(ValidationPipe) updatedVehicleData: UpdatedVehicleDataDto,
  ) {
    throw new NotImplementedException('Method not implemented');
  }

  // DELETE /vehicle/:id - Delete a specific vehicle by ID
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a vehicle',
    description: 'Delete a specific vehicle by its ID.',
  })
  @ApiResponse({ status: 200, description: 'Vehicle deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the vehicle (UUID).',
  })
  deleteVehicle(@Param('id') id: UUID) {
    throw new NotImplementedException('Method not implemented');
  }
}
