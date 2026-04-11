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
    createdAt: new Date(),
  };

  beforeEach(() => {
    prisma = {
      claim: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    } as any;

    repo = new ClaimsRepository(prisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a claim', async () => {
    prisma.claim.create.mockResolvedValue(mockClaim);

    const result = await repo.create({
      title: 'Test',
      description: 'Test desc',
      status: ClaimStatus.OPEN,
    } as any);

    expect(prisma.claim.create).toHaveBeenCalledWith({
      data: {
        title: 'Test',
        description: 'Test desc',
        status: ClaimStatus.OPEN,
      },
    });

    expect(result).toEqual(mockClaim);
  });

  it('should return all claims with pagination', async () => {
    prisma.claim.findMany.mockResolvedValue([mockClaim]);

    const result = await repo.findAll({ skip: 0, take: 10 });

    expect(prisma.claim.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    expect(result).toEqual([mockClaim]);
  });

  it('should return claims filtered by status', async () => {
    prisma.claim.findMany.mockResolvedValue([mockClaim]);

    const result = await repo.findAllByStatus({
      skip: 0,
      take: 10,
      status: ClaimStatus.OPEN,
    });

    expect(prisma.claim.findMany).toHaveBeenCalledWith({
      where: { status: ClaimStatus.OPEN },
      skip: 0,
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    expect(result).toEqual([mockClaim]);
  });

  it('should return all claims if status not provided', async () => {
    prisma.claim.findMany.mockResolvedValue([mockClaim]);

    await repo.findAllByStatus({
      skip: 0,
      take: 10,
    });

    expect(prisma.claim.findMany).toHaveBeenCalledWith({
      where: undefined,
      skip: 0,
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should find claim by id', async () => {
    prisma.claim.findUnique.mockResolvedValue(mockClaim);

    const result = await repo.findById('1');

    expect(prisma.claim.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });

    expect(result).toEqual(mockClaim);
  });

  it('should update claim', async () => {
    prisma.claim.update.mockResolvedValue({
      ...mockClaim,
      title: 'Updated',
    });

    const result = await repo.update('1', {
      title: 'Updated',
    } as any);

    expect(prisma.claim.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { title: 'Updated' },
    });

    expect(result.title).toBe('Updated');
  });

  it('should delete claim', async () => {
    prisma.claim.delete.mockResolvedValue(mockClaim);

    const result = await repo.delete('1');

    expect(prisma.claim.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    });

    expect(result).toEqual(mockClaim);
  });
});
