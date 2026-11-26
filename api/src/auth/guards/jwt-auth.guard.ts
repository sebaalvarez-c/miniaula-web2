import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiException } from '../../common/exceptions/api.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new ApiException(401, 'UNAUTHORIZED', 'Authentication required');
    }
    return user;
  }
}
