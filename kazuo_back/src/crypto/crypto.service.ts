import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private readonly algorithm = 'aes-256-cbc'; // Algoritmo de cifrado
  private readonly ivLength = 16; // Longitud del vector de inicialización (IV)
  private readonly key: Buffer; // Clave para cifrado

  constructor() {
    // Asegúrate de que la clave tenga 32 bytes
    this.key = Buffer.from(process.env.CRYPTO_KEY, 'hex');
  }

  // Método para generar un hash utilizando sha256
  generateHash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Método para generar un salt aleatorio
  generateSalt(length: number = 16): string {
    return crypto.randomBytes(length).toString('hex');
  }

  // Método para cifrar un texto con una clave
  encrypt(text: string): string {
    const iv = crypto.randomBytes(this.ivLength); // Genera un IV aleatorio
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted; // Retorna IV y texto cifrado
  }

  // Método para descifrar un texto cifrado
  decrypt(encryptedText: string): string {
    const textParts = encryptedText.split(':');
    
    // Extrae el IV
    const iv = Buffer.from(textParts.shift()!, 'hex'); 
    const encryptedTextBuffer = Buffer.from(textParts.join(':'), 'hex');

    // Verifica que el IV tenga la longitud correcta
    if (iv.length !== this.ivLength) {
      throw new Error('Invalid initialization vector length');
    }

    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    let decrypted = decipher.update(encryptedTextBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString('utf8'); // Retorna el texto descifrado como cadena
  }
}

