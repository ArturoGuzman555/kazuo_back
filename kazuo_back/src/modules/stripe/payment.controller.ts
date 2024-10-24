// import { Controller, Post, Body } from '@nestjs/common';
// import { PaymentService } from './payment.service';

// @Controller('payment')
// export class PaymentController {
//   constructor(private readonly paymentService: PaymentService) {}

//   @Post()
//   async createPayment(@Body() paymentData: any) {
//     const paymentIntent = await this.paymentService.createPaymentIntent(
//       paymentData.amount,
//       paymentData.currency,
//     );

//     return paymentIntent;
//   }

//   @Post('confirm')
//   async confirmPayment(@Body() paymentIntentId: string) {
//     const paymentIntent =
//       await this.paymentService.confirmPaymentIntent(paymentIntentId);

//     return paymentIntent;
//   }
// }



// payment.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  async createPaymentIntent(@Body() body: { amount: number, currency: string }) {
    const { amount, currency } = body;
    return await this.paymentService.createPaymentIntent(amount, currency);
  }
}
