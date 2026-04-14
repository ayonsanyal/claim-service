import { ClaimsRepository } from './claim.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClaimStatus } from '@prisma/client';

describe('ClaimsRepository', () => {
  let repo: ClaimsRepository;
  let prisma: jest.Mocked<PrismaService>;

  const mockClaim = {
    id: '1',
    title: 'Test',
    description: 'Test desc',
    status: ClaimStatus.OPEN,
    userId: 'user-1',
    createdAt: new Date(),
  };

  beforeEach(() => {
    prisma = {
      claim: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    } as any;

    repo = new ClaimsRepository(prisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should create a claim with userId', async () => {
    prisma.claim.create.mockResolvedValue(mockClaim);

    const result = await repo.create({
      title: 'Test',
      description: 'Test desc',
      status: ClaimStatus.OPEN,
      userId: 'user-1',
    } as any);

    expect(prisma.claim.create).toHaveBeenCalledWith({
      data: {
        title: 'Test',
        description: 'Test desc',
        status: ClaimStatus.OPEN,
        userId: 'user-1',
      },
    });

    expect(result).toEqual(mockClaim);
  });

  
  it('should return all claims for a user with pagination', async () => {
    prisma.claim.findMany.mockResolvedValue([mockClaim]);

    const result = await repo.findAll({
      limit: 10,
      offset: 0,
      userId: 'user-1',
    });

    expect(prisma.claim.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      skip: 0,
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    expect(result).toEqual([mockClaim]);
  });

  it('should return claims filtered by status and userId', async () => {
    prisma.claim.findMany.mockResolvedValue([mockClaim]);

    const result = await repo.findAllByStatus({
      limit: 10,
      offset: 0,
      status: ClaimStatus.OPEN,
      userId: 'user-1',
    });

    expect(prisma.claim.findMany).toHaveBeenCalledWith({
      where: {
        userId: 'user-1',
        status: ClaimStatus.OPEN,
      },
      skip: 0,
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    expect(result).toEqual([mockClaim]);
  });

 
  it('should return all claims for user if status not provided', async () => {
    prisma.claim.findMany.mockResolvedValue([mockClaim]);

    await repo.findAllByStatus({
      limit: 10,
      offset: 0,
      userId: 'user-1',
    });

    expect(prisma.claim.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      skip: 0,
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
  });

 
  it('should find claim by id and userId', async () => {
    prisma.claim.findFirst.mockResolvedValue(mockClaim);

    const result = await repo.findById('1', 'user-1');

    expect(prisma.claim.findFirst).toHaveBeenCalledWith({
      where: { id: '1', userId: 'user-1' },
    });

    expect(result).toEqual(mockClaim);
  });

 
  it('should update claim', async () => {
    prisma.claim.update.mockResolvedValue({
      ...mockClaim,
      title: 'Updated',
    });

    const result = await repo.update(
      '1',
      'user-1',
      { title: 'Updated' } as any,
    );

    expect(prisma.claim.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { title: 'Updated' },
    });

    expect(result.title).toBe('Updated');
  });


  it('should delete claim', async () => {
    prisma.claim.delete.mockResolvedValue(mockClaim);

    const result = await repo.delete('1', 'user-1');

    expect(prisma.claim.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    });

    expect(result).toEqual(mockClaim);
  });
});