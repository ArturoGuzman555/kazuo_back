import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth-guard.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from 'src/decorators/roles.enum';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  create(@Body() createCategory: CreateCategoryDto) {
    return this.categoryService.create(createCategory);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategory: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategory);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.remove(id);
  }
}
