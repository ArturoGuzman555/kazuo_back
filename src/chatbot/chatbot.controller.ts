import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ChatBotService } from './chatbot.service';

@Controller('chatbot')
export class ChatBotController {
  constructor(private readonly chatBotService: ChatBotService) {}

  @Post()
  async handleChatQuery(
    @Body('message') message: string,
    @Body('userId') userId: string,
    @Res() res: Response,
  ) {
    try {
      const response = await this.chatBotService.handleChatQuery(
        message,
        userId,
      );
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.error('Error en handleChatQuery:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Error interno del servidor' });
    }
  }
}
