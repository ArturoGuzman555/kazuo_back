import { Module } from '@nestjs/common';
import { InformesController } from './informes.controller';
import { InformesService } from './informes.service';

@Module({
  controllers: [InformesController],
  providers: [InformesService],
})
export class InformesModule {}
