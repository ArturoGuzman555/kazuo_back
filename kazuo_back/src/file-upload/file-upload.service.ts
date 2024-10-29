import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/Entities/users.entity';
import { UserRepository } from '../modules/users/users.repository'; // Asegúrate de la ruta correcta
import { FileUploadRepository } from './file-upload.repository'; // Asume que existe para manejar la subida
import { Repository } from 'typeorm';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly fileUploadRepository: FileUploadRepository,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>, // O usa `UserRepository`
  ) {}

  async uploadProfileImage(userId: string, file: Express.Multer.File) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('Usuario no encontrado');
  
    const uploadedImage = await this.fileUploadRepository.uploadImage(file);
    await this.userRepository.update(userId, {
      imgUrl: uploadedImage.secure_url,
    });
    return { ...user, imgUrl: uploadedImage.secure_url };
  }
  
}
