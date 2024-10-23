import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  // Método para generar un hash utilizando sha256
  generateHash(data: string): string {
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return hash;
  }

  // Método para generar un salt aleatorio
  generateSalt(length: number = 16): string {
    return crypto.randomBytes(length).toString('hex');
  }

  // Método para cifrar un texto con una clave y un algoritmo específico
  encrypt(text: string, key: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(key, 'hex'),
      iv,
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  // Método para descifrar un texto cifrado
  decrypt(encryptedText: string, key: string): string {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedTextBuffer = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(key, 'hex'),
      iv,
    );
    let decrypted = decipher.update(encryptedTextBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
