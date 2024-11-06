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
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Request } from 'express';
import { Role } from 'src/decorators/roles.enum';
import { Roles } from 'src/decorators/roles.decorators';
import { AuthGuard } from '../auth/guards/auth-guard.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { request } from 'http';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('bodega')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
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

  @Get('infoStore/:id')
  async getInfoBodega(@Param('id', ParseUUIDPipe) id: string) {
    const storeData = await this.storeService.getInfoBodega(id);

    const pdfBuffer = await this.storeService.generarPdf(storeData);

    await this.storeService.enviarCorreoElectronico(pdfBuffer);

    return { message: 'Informe generado y enviado por correo electrónico.' };
  }

  @Put(':id')
  @UseGuards(AuthGuard, /*RolesGuard*/)
  @Roles(Role.Admin)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStore: UpdateStoreDto,
  ) {
    return this.storeService.update(id, updateStore, request);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeService.remove(id);
  }
}
