import { Controller, UploadedFile, UseGuards, UseInterceptors, Post, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/guards/auth-guard.guard';
import { UserId } from '../decorators/user-id.decorator'; // Asegúrate de importar el decorador

@ApiTags('files')
@ApiBearerAuth()
@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('uploadProfileImage')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadProfileImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 2000000, // Tamaño máximo permitido de 200 KB
            message: 'La imagen excede el tamaño permitido',
          }),
          new FileTypeValidator({
            fileType: /jpg|jpeg|gif|png|webp|svg/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @UserId() userId: string,
  ) {
    return await this.fileUploadService.uploadProfileImage(userId, file);
  }
}
