import { Test, TestingModule } from '@nestjs/testing';
import { ClaimsGrpcController } from './claims.grpc.controller';
import { ClaimsService } from 'src/claims/service/claim.service';
import { ClaimStatus } from '@prisma/client';

describe('ClaimsGrpcController', () => {
  let controller: ClaimsGrpcController;
  let service: jest.Mocked<ClaimsService>;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClaimsGrpcController],
      providers: [
        {
          provide: ClaimsService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<ClaimsGrpcController>(ClaimsGrpcController);
    service = module.get(ClaimsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should create claim', async () => {
    await controller.createClaim({
      title: 'Test',
      description: 'Desc',
      userId,
    });

    expect(service.create).toHaveBeenCalledWith(
      { title: 'Test', description: 'Desc' },
      userId,
    );
  });

  
  it('should get claims', async () => {
    await controller.getClaims({
      limit: 10,
      offset: 0,
      userId,
    });

    expect(service.findAll).toHaveBeenCalledWith(
      { limit: 10, offset: 0 },
      userId,
    );
  });

 
  it('should get claims by status', async () => {
    await controller.getClaimsByStatus({
      status: 'OPEN',
      limit: 10,
      offset: 0,
      userId,
    });

    expect(service.findAllByStatus).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 10,
        offset: 0,
      }),
      userId,
    );
  });

  
  it('should get claim by id', async () => {
    await controller.getClaimById({ id: '1', userId });

    expect(service.findOne).toHaveBeenCalledWith('1', userId);
  });


  it('should update claim', async () => {
    await controller.updateClaim({
      id: '1',
      title: 'Updated',
      description: 'Desc',
      userId,
    });

    expect(service.update).toHaveBeenCalledWith(
      '1',
      userId,
      {
        title: 'Updated',
        description: 'Desc',
      },
    );
  });


  it('should delete claim', async () => {
    await controller.deleteClaim({ id: '1', userId });

    expect(service.delete).toHaveBeenCalledWith('1', userId);
  });

 
  it('should change status', async () => {
    await controller.changeStatus({
      id: '1',
      status: 'IN_REVIEW',
      userId,
    });

    expect(service.changeStatus).toHaveBeenCalledWith(
      '1',
      userId,
      ClaimStatus.IN_REVIEW,
    );
  });
});