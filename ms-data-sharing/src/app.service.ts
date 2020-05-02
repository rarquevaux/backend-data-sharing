import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  accumulate(data: number[]): number {
    console.log('appService');
    return (data || []).reduce((a, b) => Number(a) + Number(b));
  }
}
