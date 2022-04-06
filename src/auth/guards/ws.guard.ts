import { CanActivate, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { generateSocketToken } from '../../common/utils';
import { Socket } from 'socket.io';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(
    context: any,
  ): Promise<
    boolean | any | Promise<boolean | any> | Observable<boolean | any>
  > {
    const { isAuthorized } = await WsGuard.verifyToken(
      context.args[0],
      this.jwtService,
      this.usersService,
      this.configService,
    );
    return isAuthorized;
  }

  static async verifyToken(
    socket: Socket,
    jwtService,
    usersService,
    configService,
  ) {
    const bearerToken = socket.handshake.headers.authorization.split(' ')[1];
    let user;
    let isAuthorized = true;
    try {
      const decodedToken = jwtService.decode(bearerToken);
      user = await usersService.findOne(decodedToken['sub']);
      const isSocketTokenValid =
        decodedToken['socket_token'] ===
        generateSocketToken(
          user.id,
          configService.get('settings.socket.secret'),
        );
      if (!user || !isSocketTokenValid) {
        isAuthorized = false;
      }
    } catch (err) {
      isAuthorized = false;
    }
    return { user, isAuthorized };
  }
}
