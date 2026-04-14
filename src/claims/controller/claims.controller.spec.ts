import { Test, TestingModule } from '@nestjs/testing';
import { ClaimsController } from './claim.controller';
import { ClaimsService } from 'src/claims/service/claim.service';
import { ClaimStatus } from '@prisma/client';

describe('ClaimsController', () => {
  let controller: ClaimsController;

  const userId = 'user-1';

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllByStatus: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    changeStatus: jest.fn(),
  };

  const mockReq = {
    user: { userId },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClaimsController],
      providers: [
        { provide: ClaimsService, useValue: serviceMock },
      ],
    }).compile();

    controller = module.get<ClaimsController>(ClaimsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

 
  it('should create claim with userId', async () => {
    serviceMock.create.mockResolvedValue({ id: '1' });

    await controller.create(mockReq as any, {
      title: 'Test',
      description: 'Test desc',
    });

    expect(serviceMock.create).toHaveBeenCalledWith(
      { title: 'Test', description: 'Test desc' },
      userId,
    );
  });


  it('should call findAll with userId', async () => {
    await controller.findAll(mockReq as any, {} as any);

    expect(serviceMock.findAll).toHaveBeenCalledWith({}, userId);
  });

  
  it('should call findAllByStatus with userId', async () => {
    await controller.findAllByStatus(mockReq as any, {} as any);

    expect(serviceMock.findAllByStatus).toHaveBeenCalledWith({}, userId);
  });

  
  it('should call findOne with userId', async () => {
    await controller.findOne(mockReq as any, '1');

    expect(serviceMock.findOne).toHaveBeenCalledWith('1', userId);
  });

 
  it('should call update with userId', async () => {
    const body = { title: 'Updated' };

    await controller.update(mockReq as any, '1', body as any);

    expect(serviceMock.update).toHaveBeenCalledWith('1', userId, body);
  });

 
  it('should call delete with userId', async () => {
    await controller.delete(mockReq as any, '1');

    expect(serviceMock.delete).toHaveBeenCalledWith('1', userId);
  });

  it('should call changeStatus with userId', async () => {
    const body = {
      toEnum: () => ClaimStatus.IN_REVIEW,
    };

    await controller.changeStatus(mockReq as any, '1', body as any);

    expect(serviceMock.changeStatus).toHaveBeenCalledWith(
      '1',
      userId,
      ClaimStatus.IN_REVIEW,
    );
  });
});