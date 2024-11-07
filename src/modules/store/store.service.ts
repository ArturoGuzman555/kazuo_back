import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/Entities/store.entity';
import { In, Repository } from 'typeorm';
import { Category } from 'src/Entities/category.entity';
import { Users } from 'src/Entities/users.entity';
import PDFDocument from 'pdfkit';
import { createTransport } from 'nodemailer';
import { CompanyRepository } from 'src/company/company.repository';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly companyRepository: CompanyRepository,

  ) {}

  async create(createStore: CreateStoreDto, request: any) {
    const user: Users = request.user;
  
    // Verificar si la tienda ya existe
    const bodega = await this.storeRepository.findOne({
      where: { name: createStore.name },
    });
  
    if (bodega) {
      throw new ConflictException('La bodega ya existe');
    }
  
    const category = await this.categoryRepository.findOne({
      where: { name: createStore.categoryName },
    });
  
    if (!category) {
      throw new NotFoundException('La categoría no existe');
    }
  
    const companies = await this.companyRepository.find({
      where: { id: In(createStore.companyIds) }, 
    });
  
    if (!companies || companies.length === 0) {
      throw new NotFoundException('No se encontraron empresas para asociar');
    }
  
    const newBodega = this.storeRepository.create({
      name: createStore.name,
      category: category,
      user: { id: createStore.userId },
      companies, 
      createdAt: new Date(),
    });
  
    await this.storeRepository.save(newBodega);
    
    return { message: 'La bodega fue creada exitosamente', newBodega };
  }
  

  async findAll() {
    const hola = await this.storeRepository.find({
      relations: { category: true },
    });
    return hola.map(({ category, ...rest }) => ({
      ...rest,
      categoryId: category.id,
    }));
  }

  async findAllStores(userId: string) {
    const stores = await this.storeRepository.find({      where: { user: { id: userId } },
      relations: ['category'],
    });

    if (!stores.length) {
      throw new NotFoundException(
        `La bodega con  id ${userId} no fue encontrada`,
      );
    }

    return stores.map(({ category, ...rest }) => ({
      ...rest,
      categoryId: category.id,
    }));
  }

  async findOne(id: string) {
    const storeFound = await this.storeRepository.findOne({
      where: { id },
      relations: ['category', 'products'],
    });

    if (!storeFound) {
      throw new NotFoundException(`La bodega con ${id} no fue encontrada`);
    }

    return { message: 'Bodega encontrada', storeFound };
  }

  async update(id: string, updateStore: UpdateStoreDto, request: any) {
    const storeFound = await this.storeRepository.findOne({ where: { id } });

    if (!storeFound) {
      throw new NotFoundException('La bodega no fue encontrada');
    }

    const category = await this.categoryRepository.findOne({
      where: { name: updateStore.categoryName },
    });

    if (!category) {
      throw new NotFoundException('La categoría no existe');
    }

    const newStore = { ...storeFound, ...updateStore, category: category };

    await this.storeRepository.save(newStore);

    return {
      message: 'Bodega modificada exitosamente',
      name: newStore.name,
      categoryId: newStore.category.id,
    };
  }

  async remove(id: string) {
    const storeFound = await this.storeRepository.findOne({ where: { id } });

    if (!storeFound) {
      throw new NotFoundException('La bodega no existe');
    }

    const products = await this.storeRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (products && products.products.length > 0) {
      throw new ConflictException(
        'No se puede eliminar la tienda porque contiene productos',
      );
    }

    const deleteUser = await this.storeRepository.delete(storeFound);
    return { message: 'La bodega fue eliminada exitosamente', deleteUser };
  }

  async findByUserId(userId: string) {
    const stores = await this.storeRepository.find({
      where: { user: { id: userId } },
      relations: ['category'],
    });

    if (!stores.length) {
      throw new NotFoundException(`No stores found for user with ID ${userId}`);
    }

    return stores.map(({ category, ...rest }) => ({
      ...rest,
      categoryId: category.id,
    }));
  }

  async getInfoBodega(id: string) {
    const storeFound = await this.storeRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!storeFound) {
      throw new NotFoundException('Bodega no encontrada');
    }
    return storeFound;
  }

  async generarPdf(storeData: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      if (!storeData.products || storeData.products.length === 0) {
        console.log('No hay productos para generar el PDF');
        reject(new Error('No hay productos para generar el PDF'));
        return;
      }

      const pdf = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 20,
      });
      const chunks: Buffer[] = [];

      pdf.on('data', (chunk) => chunks.push(chunk));
      pdf.on('end', () => resolve(Buffer.concat(chunks)));
      pdf.on('error', (err) => reject(err));

      pdf
        .font('Helvetica-Bold')
        .fontSize(14)
        .text('Informe de Bodega: ${storeData.name}', { align: 'center' });
      pdf.moveDown();

      const columns = [
        { header: 'Producto', width: 70 },
        { header: 'Cantidad', width: 40 },
        { header: 'Precio', width: 60 },
        { header: 'Stock Mínimo', width: 40 },
      ];

      const tableWidth = columns.reduce((sum, col) => sum + col.width, 0);
      let startX = (pdf.page.width - tableWidth) / 2; 
      let yPosition = pdf.y;

      columns.forEach((col) => {
        pdf.rect(startX, yPosition, col.width, 15).stroke();
        pdf.text(col.header, startX, yPosition, {
          width: col.width,
          align: 'center',
        });
        startX += col.width;
      });
      yPosition += 15;

      storeData.products.forEach((product) => {
        let xPosition = startX;
        columns.forEach((col) => {
          let value = '';
          switch (col.header) {
            case 'Producto':
              value = product.name;
              break;
            case 'Cantidad':
              value = product.quantity.toString();
              break;
            case 'Precio':
              value = '${product.price}';
              break;
            case 'Stock Mínimo':
              value = product.minStock.toString();
              break;
          }
          pdf.text(value, xPosition, yPosition, {
            width: col.width,
            align: 'center',
          });
          pdf.rect(xPosition, yPosition, col.width, 15).stroke();
          xPosition += col.width;
        });
        yPosition += 15;
      });

      pdf
        .fontSize(8)
        .text(
          'Informe generado el ${new Date().toLocaleString()}',
          30,
          pdf.page.height - 30,
          { align: 'center' },
        );

      pdf.end();
    });
  }

  async enviarCorreoElectronico(pdf: Buffer) {
    const transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: '"Kazuo" <kazuoflaias@gmail.com>',
      to: 'xsaul.ortizx@gmail.com',
      subject: 'Informe de Bodega',
      text: 'Adjunto encontrarás el informe de la bodega.',
      attachments: [
        {
          filename: 'informe_bodega.pdf',
          content: pdf,
        },
      ],
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Correo enviado exitosamente:', info);
      return info;
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw error;
    }
  }
}
