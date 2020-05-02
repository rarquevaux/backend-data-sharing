import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

dotenv.config();

// Create a logger instance
const logger = new Logger('Main');

// Create the microservice options object
const microserviceOptions = {
  transport: Transport.TCP,
  options: {
    host: 'main_ms_data_sharing',
    port: 3001,
  },
};

// Create bootstrap function
async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, microserviceOptions); 
  try {
    await app.listen(() => {
      logger.log('Microservice is listening...')
    });
  } catch{
    logger.log('Error during microservice bootstrap');
  }
}

// Call bootstrap function
bootstrap();