// src/providers/providers.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  NotFoundException,
  ParseIntPipe,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ProvidersService } from './providers.service';
import { AddProductToProviderDto, CreateProviderDto } from './providers.dto';
import { Provider } from 'src/Entities/providers.entity';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from 'src/decorators/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';

@ApiTags('providers')
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Roles(Role.SuperAdmin)
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  async getProviders(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10, 
  ) {
    page = Math.max(1, page);
    limit = Math.max(1, limit);
    return this.providersService.getProviders(page, limit);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo proveedor' })
  @ApiResponse({ status: 201, description: 'Proveedor creado exitosamente', type: Provider })
  @ApiResponse({ status: 400, description: 'Error en los datos de entrada' })
  async create(@Body() createProviderDto: CreateProviderDto): Promise<Provider> {
    return await this.providersService.create(createProviderDto);
  }

  @Post(':providerId/add-product')
  @ApiOperation({ summary: 'Add a product to a provider' })
  @ApiParam({ name: 'providerId', description: 'ID of the provider' })
  @ApiResponse({
    status: 200,
    description: 'Product added to provider successfully.',
  })
  @ApiBody({ type: AddProductToProviderDto })
  async addProductToProvider(
    @Param('providerId', ParseIntPipe) providerId: string,
    @Body() addProductToProviderDto: AddProductToProviderDto,
  ) {
    return this.providersService.addProductToProvider(
      providerId,
      addProductToProviderDto.productName,
    );
  }
}
