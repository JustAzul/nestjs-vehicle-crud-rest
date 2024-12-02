import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ValidationPipe,
  Query,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  HttpStatus,
  NotImplementedException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { CreateVehicleDataDto } from './dto/create-vehicle-data.dto';
import { UpdatedVehicleDataDto } from './dto/update-vehicle-data.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { IVehicleRepository } from './repositories/interfaces/vehicle.repository';
import { ListVehicleData } from './dto/list-vehicle.dto';
import { AppError } from '@src/app.error';
import { ERROR_MESSAGES, ErrorCodes } from './constants/errors.constants';
import { DEFAULT_PAGE_SIZE } from './constants/module.contants';
import { VehicleMapper } from './vehicle.mapper';

@ApiTags('vehicles')
@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  @Get()
  @ApiOperation({
    summary: 'Get all vehicles',
    description: 'Retrieve a paginated list of all vehicles.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of vehicles retrieved successfully.',
    type: ListVehicleData,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid page or page size.',
  })
  async getAllVehicles(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = DEFAULT_PAGE_SIZE,
  ): Promise<ListVehicleData> {
    try {
      const { data, metadata } = await this.vehicleRepository.findAll({
        page,
        pageSize,
      });

      return {
        data: VehicleMapper.toDTOList(data),
        metadata,
      };
    } catch (e: unknown) {
      if (e instanceof AppError) {
        switch (e.id) {
          case ErrorCodes.INVALID_PAGE_OR_PAGE_SIZE:
          case ErrorCodes.PAGE_EXCEEDS_MAX:
            throw new BadRequestException(e.message, e.stack);
          default:
            throw new InternalServerErrorException(e.message, e.stack);
        }
      }

      throw new InternalServerErrorException(
        e instanceof Error ? e.message : e,
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get vehicle by ID',
    description: 'Retrieve details of a specific vehicle by its ID.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vehicle details retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vehicle not found.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the vehicle (UUID).',
  })
  async getVehicleById(@Param('id') id: UUID) {
    const vehicle = await this.vehicleRepository.findById({ id });

    if (!vehicle) {
      throw new NotFoundException(ERROR_MESSAGES.VEHICLE_NOT_FOUND(id));
    }

    return VehicleMapper.toDTO(vehicle);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new vehicle',
    description: 'Create a new vehicle with the provided data.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Vehicle created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  createVehicle(@Body(ValidationPipe) vehicleData: CreateVehicleDataDto) {
    throw new NotImplementedException('Method not implemented');
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a vehicle',
    description: 'Update details of an existing vehicle by its ID.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vehicle updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vehicle not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
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

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a vehicle',
    description: 'Delete a specific vehicle by its ID.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vehicle deleted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vehicle not found.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the vehicle (UUID).',
  })
  async deleteVehicle(@Param('id') id: UUID) {
    try {
      const result = await this.vehicleRepository.delete({ id });

      return {
        success: Boolean(result),
      };
    } catch (e: unknown) {
      if (e instanceof AppError) {
        switch (e.id) {
          case ErrorCodes.VEHICLE_NOT_FOUND:
            throw new NotFoundException(e.message, e.stack);
          default:
            throw new InternalServerErrorException(e.message, e.stack);
        }
      }

      throw new InternalServerErrorException(
        e instanceof Error ? e.message : e,
      );
    }
  }
}
