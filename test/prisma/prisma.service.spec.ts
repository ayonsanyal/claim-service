import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      $connect: jest.fn(),
    })),
  };
});

jest.mock('@prisma/adapter-pg', () => {
  return {
    PrismaPg: jest.fn().mockImplementation(() => ({})),
  };
});

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(() => {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
    service = new PrismaService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call PrismaClient constructor', () => {
    expect(PrismaClient).toHaveBeenCalled();
  });

  it('should connect on module init', async () => {
    const connectSpy = jest.spyOn(service, '$connect');

    await service.onModuleInit();

    expect(connectSpy).toHaveBeenCalled();
  });
});
