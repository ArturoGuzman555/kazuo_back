import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createDecipheriv, randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  // Método para desencriptar la contraseña
  async decryptPassword(
    encryptedPassword: string,
    key: Buffer,
    iv: Buffer,
  ): Promise<string> {
    try {
      const decipher = createDecipheriv('aes-256-gcm', key, iv);
      let decrypted = decipher.update(encryptedPassword, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al desencriptar la contraseña',
      );
    }
  }

  // Método para comparar la contraseña desencriptada con la contraseña hasheada
  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Generar una clave aleatoria (opcional, según tu lógica)
  generateKey(): Buffer {
    return randomBytes(32); // AES-256 requiere una clave de 32 bytes
  }
}
