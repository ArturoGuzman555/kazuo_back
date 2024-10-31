import { PartialType } from '@nestjs/swagger';
import { CreateInformeDto } from './create-informe.dto';

export class UpdateInformeDto extends PartialType(CreateInformeDto) {}
