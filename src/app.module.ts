import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { ElementEntity } from './entities/Element.entity';
import path, { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([ElementEntity]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5555,
      username: 'root',
      password: 'root',
      database: 'tree',
      synchronize: true,
      logging: false,
      entities: [__dirname + '/**/**.entity{.ts,.js}'],
      // entities: ['src/**/*{.entity.ts}'],
      // entities: [join(__dirname, 'src/*.entity{.ts,.js}')],
      // entities: ['./entities/*.entity.ts'],

      // entities: [path.resolve(__dirname, 'entities/*.entity{.ts,.js}')],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
