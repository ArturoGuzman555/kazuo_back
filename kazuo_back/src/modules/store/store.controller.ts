import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
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
  create(@Body() createStore: CreateStoreDto, @Req() request: Request) {
    return this.storeService.create(createStore, request);
  }

  @Get('user/:userId')
  async getStoresByUserId(@Param('userId') userId: string) {
    return this.storeService.findByUserId(userId);
  }

  @Get()
  findAll() {
    return this.storeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStore: UpdateStoreDto,
  ) {
    return this.storeService.update(id, updateStore);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeService.remove(id);
  }
}
