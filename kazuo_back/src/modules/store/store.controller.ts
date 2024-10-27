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
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Request } from 'express';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('bodega')
  async create(@Body() createStore: CreateStoreDto, @Req() request: Request) {
    return this.storeService.create(createStore, request);
  }

  @Get()
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
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStore: UpdateStoreDto,
  ) {
    return this.storeService.update(id, updateStore);
  }

  @Delete(':id')
 async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeService.remove(id);
  }
}
