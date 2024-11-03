import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/modules/auth/guards/auth-guard.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './user.dto';
import { Role } from '../../decorators/roles.enum';
import { UserOwnershipGuard } from '../auth/guards/usership.guard';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Roles(Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 2,
  ) {
    page = Math.max(1, page);
    limit = Math.max(1, limit);
    return this.usersService.getUsers(page, limit);
  }
  @Get(':id')
  @UseGuards(AuthGuard, UserOwnershipGuard)
  @HttpCode(200)
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserById(id);
  }

  @Put(':id')
  @ApiBody({ type: UpdateUserDto })
  @UseGuards(AuthGuard, UserOwnershipGuard)
  async updatedUser(@Param('id', ParseUUIDPipe) id: string, @Body() user) {
    return this.usersService.updateUser(id, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
