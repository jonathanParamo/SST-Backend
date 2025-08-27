import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { connect, Connection } from 'mongoose';

@Injectable()
export class MongoService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection;

  async onModuleInit() {
    this.connection = (
      await connect(process.env.DATABASE_URI as string)
    ).connection;
    console.log('✅ MongoDB conectado');
  }

  async onModuleDestroy() {
    if (this.connection) {
      await this.connection.close();
      console.log('❌ MongoDB desconectado');
    }
  }

  getConnection(): Connection {
    return this.connection;
  }
}
