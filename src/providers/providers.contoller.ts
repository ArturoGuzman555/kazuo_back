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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ProvidersService } from './providers.service';
import { AddProductToProviderDto, CreateProviderDto } from './providers.dto';
import { Provider } from 'src/Entities/providers.entity';
import { AuthGuard } from 'src/modules/auth/guards/auth-guard.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from 'src/decorators/roles.enum';

@ApiTags('providers')
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @ApiOperation({ summary: 'Obtener todos los proveedores' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos los proveedores',
    type: Provider,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  async getAllProviders(): Promise<Provider[]> {
    return this.providersService.getAllProviders();
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Crear un nuevo proveedor' })
  @ApiResponse({
    status: 201,
    description: 'Proveedor creado exitosamente',
    type: Provider,
  })
  @ApiResponse({ status: 400, description: 'Error en los datos de entrada' })
  async create(
    @Body() createProviderDto: CreateProviderDto,
  ): Promise<Provider> {
    return await this.providersService.create(createProviderDto);
  }

  @Post(':providerId/add-product')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
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
