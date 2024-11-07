import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  NotFoundException,
  UseGuards,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CompanyService } from './company.service';
import {
  AddUserToCompanyDto,
  CreateCompanyDto,
  UpdateCompanyDto,
} from './company.dto';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from 'src/decorators/roles.enum';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { AuthGuard } from 'src/modules/auth/guards/auth-guard.guard';
import { Company } from 'src/Entities/company.entity';

@ApiTags('companies')
@ApiBearerAuth()
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiOperation({ summary: 'Obtener todas las compañías' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas las compañías',
    type: Company,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  async getAllCompanies(): Promise<Company[]> {
    return this.companyService.getAllCompanies();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener las compañías de un usuario específico' })
  @ApiResponse({
    status: 200,
    description: 'Lista de compañías del usuario',
    type: Company,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getCompaniesByUserId(
    @Param('userId') userId: string,
  ): Promise<Company[]> {
    return this.companyService.getCompaniesByUserId(userId);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiResponse({ status: 201, description: 'Compañía creada exitosamente.' })
  @ApiResponse({
    status: 409,
    description: 'Conflicto: la compañía ya existe.',
  })
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.createCompany(createCompanyDto);
  }

  @Post(':companyId/users')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Agregar un usuario a una compañía' })
  @ApiResponse({ status: 200, description: 'Usuario agregado a la compañía.' })
  @ApiResponse({
    status: 404,
    description: 'Usuario o compañía no encontrada.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto al agregar el usuario a la compañía.',
  })
  async addUserToCompany(
    @Param('companyId') companyId: string,
    @Body() addUserToCompanyDto: AddUserToCompanyDto,
  ): Promise<void> {
    return this.companyService.addUserToCompany(
      addUserToCompanyDto.email,
      companyId,
    );
  }

  @Put(':companyId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Actualizar datos de una compañía' })
  @ApiResponse({
    status: 200,
    description: 'Compañía actualizada exitosamente',
    type: Company,
  })
  @ApiResponse({ status: 404, description: 'Compañía no encontrada' })
  async updateCompany(
    @Param('companyId') companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    return this.companyService.updateCompany(companyId, updateCompanyDto);
  }

  @Get('AllStoresCompany/:companyId')
  async storesByCompany(@Param('companyId') companyId: string) {
    return this.companyService.storesByCompany(companyId);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Obtener compañía por ID' })  // Descripción de la operación
  @ApiParam({
    name: 'id',
    description: 'ID único de la compañía',
    type: String,
  })  // Descripción del parámetro 'id'
  @ApiResponse({
    status: 200,
    description: 'Compañía encontrada',
    type: Company,  // Define el tipo de respuesta exitosa
  })
  @ApiResponse({
    status: 404,
    description: 'Compañía no encontrada',
  })
  async getCompanyById(@Param('id') id: string): Promise<Company> {
    return this.companyService.getCompanyById(id);
  }
}
