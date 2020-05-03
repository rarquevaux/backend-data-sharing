import { Injectable, Logger } from '@nestjs/common';
import { ShareMessage } from './shareMessage.interface';

@Injectable()
export class AppService {

  private logger = new Logger('AppService');

  share(message: ShareMessage): string {
    this.logger.log("sharing item with recipient...")
    return "sharing item";
  }
}
