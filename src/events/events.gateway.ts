import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({
  cors: {
    origin: '*', // frontend
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  async handleConnection(client: Socket) {
    try {
      let token =
        client.handshake.auth?.token || client.handshake.headers?.authorization;

      if (!token) {
        this.logger.warn(`❌ Cliente rechazado (sin token) - ID: ${client.id}`);
        client.disconnect();
        return;
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'mi_super_clave_secreta',
      );

      this.logger.log(
        `✅ Cliente conectado: ${client.id} - UserID: ${decoded['sub']}`,
      );

      (client as any).user = decoded;
    } catch (err) {
      this.logger.error(`⚠️ Token inválido para cliente: ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`🔌 Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = (client as any).user;
    this.logger.debug(`📩 Mensaje de ${user?.sub || 'desconocido'}: ${data}`);

    // mandar a uno:
    client.emit('messageResponse', `Servidor recibió: ${data}`);

    // mandar a todos:
    this.server.emit('broadcast', {
      from: user?.sub || 'anon',
      message: data,
    });
  }
}
