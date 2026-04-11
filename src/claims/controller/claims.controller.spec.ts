import { ClaimsController } from './claim.controller';
import { ClaimsService } from 'src/claims/service/claim.service';
import { ClaimStatus } from '@prisma/client';

describe('ClaimsController', () => {
  let controller: ClaimsController;
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

    controller = new ClaimsController(service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create claim', async () => {
    service.create.mockResolvedValue(mockClaim);

    const dto: any = {
      title: 'Test',
      description: 'Test desc',
    };

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockClaim);
  });

  it('should return all claims', async () => {
    const response = {
      limit: 10,
      offset: 0,
      count: 1,
      data: [mockClaim],
    };

    service.findAll.mockResolvedValue(response);

    const query: any = { limit: 10, offset: 0 };

    const result = await controller.findAll(query);

    expect(service.findAll).toHaveBeenCalledWith(query);
    expect(result).toEqual(response);
  });

  it('should return claims by status', async () => {
    const response = {
      limit: 10,
      offset: 0,
      count: 1,
      data: [mockClaim],
    };

    service.findAllByStatus.mockResolvedValue(response);

    const query: any = { status: 'OPEN', limit: 10, offset: 0 };

    const result = await controller.findAllByStatus(query);

    expect(service.findAllByStatus).toHaveBeenCalledWith(query);
    expect(result).toEqual(response);
  });

  it('should return claim by id', async () => {
    service.findOne.mockResolvedValue(mockClaim);

    const result = await controller.findOne('1');

    expect(service.findOne).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockClaim);
  });

  it('should update claim', async () => {
    const dto: any = {
      getNormalizedStatus: jest.fn().mockReturnValue(ClaimStatus.CLOSED),
    };

    service.update.mockResolvedValue({
      ...mockClaim,
      status: ClaimStatus.CLOSED,
    });

    const result = await controller.update('1', dto);

    expect(dto.getNormalizedStatus).toHaveBeenCalled();
    expect(service.update).toHaveBeenCalledWith('1', ClaimStatus.CLOSED);

    expect(result.status).toBe(ClaimStatus.CLOSED);
  });

  it('should delete claim', async () => {
    service.delete.mockResolvedValue(mockClaim);

    const result = await controller.delete('1');

    expect(service.delete).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockClaim);
  });

  it('should change claim status', async () => {
    const dto: any = {
      toEnum: jest.fn().mockReturnValue(ClaimStatus.IN_REVIEW),
    };

    service.changeStatus.mockResolvedValue({
      ...mockClaim,
      status: ClaimStatus.IN_REVIEW,
    });

    const result = await controller.changeStatus('1', dto);

    expect(dto.toEnum).toHaveBeenCalled();
    expect(service.changeStatus).toHaveBeenCalledWith(
      '1',
      ClaimStatus.IN_REVIEW,
    );

    expect(result.status).toBe(ClaimStatus.IN_REVIEW);
  });
});
