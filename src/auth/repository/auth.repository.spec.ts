import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepository } from './auth.repository';
import { PrismaService } from 'src/prisma/prisma.service';

describe('AuthRepository', () => {
  let repo: AuthRepository;

  const prismaMock = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRepository,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    repo = module.get<AuthRepository>(AuthRepository);
  });

  it('should create user', async () => {
    prismaMock.user.create.mockResolvedValue({ id: '1', email: 'test@test.com' });

    const result = await repo.create({
      email: 'test@test.com',
      password: 'hashed',
    });

    expect(prismaMock.user.create).toHaveBeenCalled();
    expect(result.email).toBe('test@test.com');
  });

  it('should find by email', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: '1', email: 'test@test.com' });

    const result = await repo.findByEmail('test@test.com');

    expect(result?.email).toBe('test@test.com');
  });

  it('should paginate users', async () => {
    prismaMock.user.findMany.mockResolvedValue([]);

    await repo.findAll({ limit: 10, offset: 5 });

    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      skip: 5,
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should update user', async () => {
    prismaMock.user.update.mockResolvedValue({ id: '1' });

    const result = await repo.update('1', { email: 'new@test.com' });

    expect(result).toHaveProperty('id');
  });

  it('should delete user', async () => {
    prismaMock.user.delete.mockResolvedValue({ id: '1' });

    const result = await repo.delete('1');

    expect(result).toHaveProperty('id');
  });
});