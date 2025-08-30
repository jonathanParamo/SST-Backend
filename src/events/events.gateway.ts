import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({
  cors: {
    origin: '*', // tu frontend
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    try {
      let token =
        client.handshake.auth?.token || client.handshake.headers?.authorization;

      if (!token) {
        console.log('Cliente rechazado: no envió token');
        client.disconnect();
        return;
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'mi_super_clave_secreta',
      );
      console.log(
        `Cliente conectado: ${client.id} - UserID: ${decoded['sub']}`,
      );

      (client as any).user = decoded;
    } catch (err) {
      console.log('Token inválido, desconectando...');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = (client as any).user;
    console.log(`Mensaje de ${user?.sub || 'desconocido'}: ${data}`);

    // mandar a uno:
    client.emit('messageResponse', `Servidor recibió: ${data}`);

    // mandar a todos:
    this.server.emit('broadcast', {
      from: user?.sub || 'anon',
      message: data,
    });
  }
}
