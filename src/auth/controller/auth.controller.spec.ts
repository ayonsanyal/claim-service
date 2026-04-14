import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from 'src/auth/service/auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const serviceMock = {
    register: jest.fn(),
    login: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should call service.register with email and password', async () => {
    serviceMock.register.mockResolvedValue({ id: '1' });

    const dto = { email: 'test@test.com', password: 'abc123' };

    const result = await controller.register(dto as any);

    expect(serviceMock.register).toHaveBeenCalledWith(
      dto.email,
      dto.password,
    );
    expect(result).toEqual({ id: '1' });
  });


  it('should call service.login with email and password', async () => {
    serviceMock.login.mockResolvedValue({ access_token: 'token' });

    const dto = { email: 'test@test.com', password: 'abc123' };

    const result = await controller.login(dto as any);

    expect(serviceMock.login).toHaveBeenCalledWith(
      dto.email,
      dto.password,
    );
    expect(result).toHaveProperty('access_token');
  });

  
  it('should call service.findAll with parsed limit and offset', async () => {
    serviceMock.findAll.mockResolvedValue([]);

    await controller.findAll('10', '5');

    expect(serviceMock.findAll).toHaveBeenCalledWith({
      limit: 10,
      offset: 5,
    });
  });

  it('should handle undefined pagination params', async () => {
    serviceMock.findAll.mockResolvedValue([]);

    await controller.findAll(undefined, undefined);

    expect(serviceMock.findAll).toHaveBeenCalledWith({
      limit: undefined,
      offset: undefined,
    });
  });


  it('should call service.findById', async () => {
    serviceMock.findById.mockResolvedValue({ id: '1' });

    const result = await controller.findById('1');

    expect(serviceMock.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual({ id: '1' });
  });


  it('should call service.update', async () => {
    const updateData = { email: 'new@test.com' };

    serviceMock.update.mockResolvedValue({ id: '1', ...updateData });

    const result = await controller.update('1', updateData as any);

    expect(serviceMock.update).toHaveBeenCalledWith('1', updateData);
    expect(result).toHaveProperty('email', 'new@test.com');
  });


  it('should call service.delete', async () => {
    serviceMock.delete.mockResolvedValue({ id: '1' });

    const result = await controller.delete('1');

    expect(serviceMock.delete).toHaveBeenCalledWith('1');
    expect(result).toEqual({ id: '1' });
  });
});