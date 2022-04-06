import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { Injectable, UseGuards } from '@nestjs/common';
import { WsGuard } from '../auth/guards/ws.guard';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: { origin: '*' },
})
@UseGuards(WsGuard)
@Injectable()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    const { user, isAuthorized } = await WsGuard.verifyToken(
      socket,
      this.jwtService,
      this.usersService,
      this.configService,
    );

    if (!isAuthorized) {
      socket.disconnect(true);
      return;
    }

    socket.join(`user.${user.id}`);
    console.log(`New connection! socketId: ${socket.id}, userId: ${user.id}`);
  }

  handleDisconnect(socket: Socket): void {
    console.log('Disconnect!');
  }

  @SubscribeMessage('events')
  findAll(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  to(userId: number) {
    return this.server.to(`user.${userId}`);
  }
}
