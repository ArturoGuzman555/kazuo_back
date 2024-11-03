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
    private readonly userRepository: Repository<Users>,
  ) {}

  async uploadProfileImage(userId: string, file: Express.Multer.File) {
    // Validar que el usuario exista
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Subir la imagen y obtener la URL
    const uploadedImage = await this.fileUploadRepository.uploadImage(file);
    if (!uploadedImage?.secure_url) {
      throw new Error('Error al cargar la imagen'); // Control de error básico
    }

    // Actualizar la URL de la imagen en el perfil del usuario
    await this.userRepository.update(userId, {
      imgUrl: uploadedImage.secure_url,
    });

    // Retornar el usuario con la URL actualizada (opcional: evita campos sensibles)
    return {
      id: user.id,
      username: user.name,
      imgUrl: uploadedImage.secure_url,
    };
  }
}
