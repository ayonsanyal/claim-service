import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from 'src/auth/repository/auth.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const repoMock = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const jwtMock = {
    sign: jest.fn().mockReturnValue('token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepository, useValue: repoMock },
        { provide: JwtService, useValue: jwtMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should register user (hash password)', async () => {
    repoMock.create.mockResolvedValue({ id: '1' });

    await service.register('test@test.com', '123456');

    expect(repoMock.create).toHaveBeenCalled();
    const callArg = repoMock.create.mock.calls[0][0];

    expect(callArg.password).not.toBe('123456'); 
  });

  it('should login successfully', async () => {
    const hashed = await bcrypt.hash('123456', 10);

    repoMock.findByEmail.mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      password: hashed,
    });

    const result = await service.login('test@test.com', '123456');

    expect(result).toHaveProperty('access_token');
  });

  it('should fail if email not found', async () => {
    repoMock.findByEmail.mockResolvedValue(null);

    await expect(
      service.login('wrong@test.com', '123456'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should fail if password is invalid', async () => {
    const hashed = await bcrypt.hash('correct', 10);

    repoMock.findByEmail.mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      password: hashed,
    });

    await expect(
      service.login('test@test.com', 'wrong'),
    ).rejects.toThrow(UnauthorizedException);
  });
});