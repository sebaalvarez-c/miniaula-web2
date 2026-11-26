import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiException } from '../common/exceptions/api.exception';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  create(data: Partial<User>) {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user) throw new ApiException(404, 'NOT_FOUND', 'User not found');
    if (dto.email && dto.email !== user.email) {
      const existing = await this.findByEmail(dto.email);
      if (existing) throw new ApiException(409, 'EMAIL_TAKEN', 'Email already registered');
    }
    Object.assign(user, dto);
    await this.repo.save(user);
    return this.toPublic(user);
  }

  toPublic(user: User) {
    const { passwordHash: _passwordHash, ...pub } = user;
    return pub;
  }
}
