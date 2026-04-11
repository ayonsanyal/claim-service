import { ClaimsGrpcController } from './claims.grpc.controller';
import { ClaimsService } from 'src/claims/service/claim.service';
import { ClaimStatus } from '@prisma/client';

describe('ClaimsGrpcController', () => {
  let controller: ClaimsGrpcController;
  let service: jest.Mocked<ClaimsService>;

  const mockClaim = {
    id: '1',
    title: 'Test',
    description: 'Test desc',
    status: ClaimStatus.OPEN,
    createdAt: new Date(),
  };

  beforeEach(() => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findAllByStatus: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      changeStatus: jest.fn(),
    } as any;

    controller = new ClaimsGrpcController(service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create claim', async () => {
    service.create.mockResolvedValue(mockClaim);

    const result = await controller.createClaim({
      title: 'Test',
      description: 'Test desc',
    });

    expect(service.create).toHaveBeenCalled();
    expect(result).toEqual({ claim: mockClaim });
  });

  it('should get claims with default pagination', async () => {
    service.findAll.mockResolvedValue({
      limit: 10,
      offset: 0,
      count: 1,
      data: [mockClaim],
    });

    const result = await controller.getClaims({});

    expect(service.findAll).toHaveBeenCalledWith({
      limit: 10,
      offset: 0,
    });

    expect(result.count).toBe(1);
  });

  it('should get claims by status', async () => {
    service.findAllByStatus.mockResolvedValue({
      limit: 10,
      offset: 0,
      count: 1,
      data: [mockClaim],
    });

    const result = await controller.getClaimsByStatus({
      status: 'open',
      limit: 5,
      offset: 0,
    });

    expect(service.findAllByStatus).toHaveBeenCalled();

    const queryArg = service.findAllByStatus.mock.calls[0][0];

    expect(queryArg.getNormalizedStatus()).toBe(ClaimStatus.OPEN);

    expect(result.count).toBe(1);
  });

  it('should get claim by id', async () => {
    service.findOne.mockResolvedValue(mockClaim);

    const result = await controller.getClaimById({ id: '1' });

    expect(service.findOne).toHaveBeenCalledWith('1');
    expect(result).toEqual({ claim: mockClaim });
  });

  it('should update claim with normalized status', async () => {
    service.update.mockResolvedValue(mockClaim);

    const result = await controller.updateClaim({
      id: '1',
      title: 'Updated',
      status: 'closed',
    });

    expect(service.update).toHaveBeenCalledWith('1', {
      id: '1',
      title: 'Updated',
      status: ClaimStatus.CLOSED,
    });

    expect(result).toEqual({ claim: mockClaim });
  });

  it('should delete claim', async () => {
    service.delete.mockResolvedValue(mockClaim);

    const result = await controller.deleteClaim({ id: '1' });

    expect(service.delete).toHaveBeenCalledWith('1');
    expect(result).toEqual({ claim: mockClaim });
  });

  it('should change status with normalization', async () => {
    service.changeStatus.mockResolvedValue({
      ...mockClaim,
      status: ClaimStatus.IN_REVIEW,
    });

    const result = await controller.changeStatus({
      id: '1',
      status: 'in_review',
    });

    expect(service.changeStatus).toHaveBeenCalledWith(
      '1',
      ClaimStatus.IN_REVIEW,
    );

    expect(result.claim.status).toBe(ClaimStatus.IN_REVIEW);
  });
});
