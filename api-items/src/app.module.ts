import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from './items/items.module';
import { Item } from './items/item.entity';
import { AuthzModule } from './authz/authz.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    // TO DO -> use ConfigModule to pass config
    // ConfigModule exposes a ConfigService wich loads the .env file
    //ConfigModule.forRoot(),
    //TO DO -> create an ormconfig.json file
    TypeOrmModule.forRoot({
      type: "postgres",
      host: 'postgres',
      port: 5432,
      username: `${process.env.DB_USERNAME}`,
      password: `${process.env.DB_PASSWORD}`,
      database: `${process.env.DB_DATABASE_NAME}`,
      entities: [Item],
      synchronize: true,

    }),
    ItemsModule,
    AuthzModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
