import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
  Query,
  Req,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Request } from 'express';
import { Role } from 'src/decorators/roles.enum';
import { Roles } from 'src/decorators/roles.decorators';
import { AuthGuard } from '../auth/guards/auth-guard.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Users } from 'src/Entities/users.entity';
import { Store } from 'src/Entities/store.entity';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('bodega')
  @ApiOperation({ summary: 'Crear una nueva tienda (bodega)' })
  @ApiCreatedResponse({
    description: 'La tienda (bodega) fue creada exitosamente.',
    type: Store,
  })
  @ApiConflictResponse({
    description: 'La tienda ya existe.',
  })
  @ApiBadRequestResponse({
    description: 'La solicitud tiene datos inválidos.',
  })
  async create(@Body() createStore: CreateStoreDto, @Req() request: Request) {
    return this.storeService.create(createStore, request);
  }

  @Get('user/:userId')
  async getStoresByUserId(@Param('userId') userId: string) {
    return this.storeService.findByUserId(userId);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  findAll() {
    return this.storeService.findAll();
  }

  @Get('AllStoresUser/:userId')
  async findAllStores(@Param('userId') userId: string) {
    return this.storeService.findAllStores(userId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStore: UpdateStoreDto,
  ) {
    return this.storeService.update(id, updateStore);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeService.remove(id);
  }
}
