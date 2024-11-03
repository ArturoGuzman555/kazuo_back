import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  NotFoundException,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { AddUserToCompanyDto, CreateCompanyDto } from './company.dto';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from 'src/decorators/roles.enum';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { AuthGuard } from 'src/modules/auth/guards/auth-guard.guard';

@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Roles(Role.SuperAdmin) // Ajusta según tu lógica de roles
  @UseGuards(AuthGuard, RolesGuard) // Ajusta el tipo de guardia según tu implementación
  async getCompanies(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10, // Cambié el valor predeterminado a 10 para más resultados
  ) {
    page = Math.max(1, page);
    limit = Math.max(1, limit);
    return this.companyService.getCompanies(page, limit);
  }

  @Post()
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
}
