import { Module } from '@nestjs/common';
import { StripeService } from './payment.service';
import { StripeController } from './payment.controller';
import { UsersModule } from '../users/users.module';
import { MailService } from 'src/mail/mail.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  controllers: [StripeController],
  providers: [StripeService],
  imports: [UsersModule, MailModule],
})
export class StripeModule {}
