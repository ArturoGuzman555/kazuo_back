import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly ivLength = 16;
  private readonly key: Buffer;

  constructor() {
    this.key = Buffer.from(process.env.CRYPTO_KEY, 'hex');
  }

  generateHash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  generateSalt(length: number = 16): string {
    return crypto.randomBytes(length).toString('hex');
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  decrypt(encryptedText: string): string {
    const textParts = encryptedText.split(':');

    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedTextBuffer = Buffer.from(textParts.join(':'), 'hex');

    if (iv.length !== this.ivLength) {
      throw new Error('Invalid initialization vector length');
    }

    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    let decrypted = decipher.update(encryptedTextBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString('utf8');
  }
}
