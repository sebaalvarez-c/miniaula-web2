import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiException } from '../common/exceptions/api.exception';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ApiException(409, 'EMAIL_TAKEN', 'Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({ ...dto, passwordHash });
    const token = this.signToken(user);
    return { token, user: this.usersService.toPublic(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new ApiException(401, 'INVALID_CREDENTIALS', 'Invalid email or password');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new ApiException(401, 'INVALID_CREDENTIALS', 'Invalid email or password');

    const token = this.signToken(user);
    return { token, user: this.usersService.toPublic(user) };
  }

  private signToken(user: any) {
    return this.jwtService.sign({ sub: user.id, email: user.email, rol: user.rol });
  }
}
