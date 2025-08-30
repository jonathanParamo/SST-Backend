import { Module } from '@nestjs/common';
import { MongoService } from './database.service';

@Module({
  providers: [MongoService],
  exports: [MongoService],
})
export class DbModule {}
