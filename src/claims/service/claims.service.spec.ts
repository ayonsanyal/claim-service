import { ClaimsService } from './claim.service';
import { ClaimsRepository } from 'src/claims/repository/claim.repository';
import { BadRequestException } from '@nestjs/common';
import { ClaimStatus } from '@prisma/client';

describe('ClaimsService', () => {
  let service: ClaimsService;
  let repo: jest.Mocked<ClaimsRepository>;

  const userId = 'user-1';

  const mockClaim = {
    id: '1',
    title: 'Test',
    description: 'Test desc',
    status: ClaimStatus.OPEN,
    userId,
    createdAt: new Date(),
  };

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findAllByStatus: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    service = new ClaimsService(repo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should create a claim with OPEN status and userId', async () => {
    repo.create.mockResolvedValue(mockClaim);

    const result = await service.create(
      { title: 'Test', description: 'Test desc' },
      userId,
    );

    expect(repo.create).toHaveBeenCalledWith({
      title: 'Test',
      description: 'Test desc',
      status: ClaimStatus.OPEN,
      userId,
    });

    expect(result).toEqual(mockClaim);
  });

  
  it('should return paginated claims with userId', async () => {
    repo.findAll.mockResolvedValue([mockClaim]);

    const query: any = { limit: 10, offset: 0 };

    const result = await service.findAll(query, userId);

    expect(repo.findAll).toHaveBeenCalledWith({
      limit: 10,
      offset: 0,
      userId,
    });

    expect(result).toEqual({
      limit: 10,
      offset: 0,
      count: 1,
      data: [mockClaim],
    });
  });

 
  it('should return claims filtered by status and userId', async () => {
    repo.findAllByStatus.mockResolvedValue([mockClaim]);

    const query: any = {
      limit: 10,
      offset: 0,
      getNormalizedStatus: () => ClaimStatus.OPEN,
    };

    const result = await service.findAllByStatus(query, userId);

    expect(repo.findAllByStatus).toHaveBeenCalledWith({
      limit: 10,
      offset: 0,
      status: ClaimStatus.OPEN,
      userId,
    });

    expect(result).toEqual({
      limit: 10,
      offset: 0,
      count: 1,
      data: [mockClaim],
    });
  });

 
  it('should return claim if found (with userId)', async () => {
    repo.findById.mockResolvedValue(mockClaim);

    const result = await service.findOne('1', userId);

    expect(repo.findById).toHaveBeenCalledWith('1', userId);
    expect(result).toEqual(mockClaim);
  });

  it('should throw if claim not found', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.findOne('1', userId)).rejects.toThrow(
      BadRequestException,
    );
  });


  it('should update claim if exists', async () => {
    repo.findById.mockResolvedValue(mockClaim);
    repo.update.mockResolvedValue({
      ...mockClaim,
      title: 'Updated',
    });

    const result = await service.update(
      '1',
      userId,
      { title: 'Updated' },
    );

    expect(repo.update).toHaveBeenCalledWith('1', userId, {
      title: 'Updated',
    });

    expect(result.title).toBe('Updated');
  });

  it('should throw when updating non-existing claim', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.update('1', userId, {})).rejects.toThrow(
      BadRequestException,
    );
  });

  
  it('should delete claim if exists', async () => {
    repo.findById.mockResolvedValue(mockClaim);
    repo.delete.mockResolvedValue(mockClaim);

    const result = await service.delete('1', userId);

    expect(repo.delete).toHaveBeenCalledWith('1', userId);
    expect(result).toEqual(mockClaim);
  });

  it('should throw when deleting non-existing claim', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.delete('1', userId)).rejects.toThrow(
      BadRequestException,
    );
  });

  
  it('should allow valid transition OPEN → IN_REVIEW', async () => {
    repo.findById.mockResolvedValue({
      ...mockClaim,
      status: ClaimStatus.OPEN,
    });

    repo.update.mockResolvedValue({
      ...mockClaim,
      status: ClaimStatus.IN_REVIEW,
    });

    const result = await service.changeStatus(
      '1',
      userId,
      ClaimStatus.IN_REVIEW,
    );

    expect(repo.update).toHaveBeenCalledWith('1', userId, {
      status: ClaimStatus.IN_REVIEW,
    });

    expect(result.status).toBe(ClaimStatus.IN_REVIEW);
  });

  it('should throw for invalid transition OPEN → CLOSED', async () => {
    repo.findById.mockResolvedValue({
      ...mockClaim,
      status: ClaimStatus.OPEN,
    });

    await expect(
      service.changeStatus('1', userId, ClaimStatus.CLOSED),
    ).rejects.toThrow(BadRequestException);
  });
});