import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiException } from '../../common/exceptions/api.exception';
import { AuthUser } from '../../common/types/auth-user.type';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = AuthUser>(err: Error | null, user: TUser | false): TUser {
    if (err || !user) {
      throw new ApiException(401, 'UNAUTHORIZED', 'Authentication required');
    }
    return user;
  }
}
