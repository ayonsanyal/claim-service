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
    getFunnelConfig: jest.fn(),
    reorderSteps: jest.fn(),
    switchVariant: jest.fn(),
    restoreVersion: jest.fn(),
    getVersions: jest.fn(),
  };

  const mockReq = {
    user: { userId },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClaimsController],
      providers: [{ provide: ClaimsService, useValue: serviceMock }],
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

  it('should get funnel config', async () => {
    serviceMock.getFunnelConfig.mockResolvedValue({
      version: 1,
    });

    await controller.getConfig(mockReq as any);

    expect(serviceMock.getFunnelConfig).toHaveBeenCalledWith(userId);
  });

  it('should reorder steps', async () => {
    await controller.reorder({
      stepIds: ['list', 'create'],
    });

    expect(serviceMock.reorderSteps).toHaveBeenCalledWith(['list', 'create']);
  });

  it('should switch variant', async () => {
    await controller.switchVariant('B');

    expect(serviceMock.switchVariant).toHaveBeenCalledWith('B');
  });

  it('should restore version', async () => {
    await controller.restore('2');

    expect(serviceMock.restoreVersion).toHaveBeenCalledWith(2);
  });

  it('should get versions', async () => {
    await controller.versions();

    expect(serviceMock.getVersions).toHaveBeenCalled();
  });
});
