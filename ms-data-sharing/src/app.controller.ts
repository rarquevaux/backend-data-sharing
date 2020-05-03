import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from "@nestjs/microservices";
import { ShareMessage } from './shareMessage.interface';

@Controller()
export class AppController {

  private logger = new Logger('AppController');

  constructor(private appService: AppService) {}

  @MessagePattern('share')
  async share(message: ShareMessage): Promise<string> {
    return this.appService.share(message);
  }
}