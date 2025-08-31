import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ReportsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  notifyNewReport(report: any, rolesAllowed: string[]) {
    this.server.sockets.sockets.forEach((socket: any) => {
      if (rolesAllowed.includes(socket.handshake.auth.role)) {
        socket.emit('newReport', report);
      }
    });
  }

  notifyReportUpdated(report: any, rolesAllowed: string[]) {
    this.server.sockets.sockets.forEach((socket: any) => {
      if (rolesAllowed.includes(socket.handshake.auth.role)) {
        socket.emit('reportUpdated', report);
      }
    });
  }

  notifyReportAssigned(report: any, rolesAllowed: string[]) {
    this.server.sockets.sockets.forEach((socket: any) => {
      if (rolesAllowed.includes(socket.handshake.auth.role)) {
        socket.emit('reportAssigned', report);
      }
    });
  }
}
