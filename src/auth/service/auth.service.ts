import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from 'src/auth/repository/auth.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);

    return this.authRepository.create({
      email,
      password: hashed,
    });
  }

  async login(email: string, password: string) {
    const user = await this.authRepository.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findAll(params: { limit?: number; offset?: number }) {
    return this.authRepository.findAll(params);
  }

  async findById(id: string) {
    return this.authRepository.findById(id);
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return this.authRepository.update(id, data);
  }

  async delete(id: string) {
    return this.authRepository.delete(id);
  }
}