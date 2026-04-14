import { LoggingInterceptor } from './logging.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockHttpContext = (): ExecutionContext =>
    ({
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          url: '/claims',
        }),
      }),
    }) as any;

  const mockRpcContext = (): ExecutionContext =>
    ({
      getType: () => 'rpc',
      switchToRpc: () => ({
        getData: () => ({ limit: 10 }),
      }),
      getHandler: () => ({
        name: 'getClaims',
      }),
    }) as any;

  it('should log HTTP request success', (done) => {
    const context = mockHttpContext();

    const next: CallHandler = {
      handle: () => of({ data: 'ok' }),
    };

    const logSpy = jest
      .spyOn((interceptor as any).logger, 'log')
      .mockImplementation();

    interceptor.intercept(context, next).subscribe(() => {
      expect(logSpy).toHaveBeenCalled();

      const logArg = logSpy.mock.calls[0][0];
      const parsed = JSON.parse(logArg);

      expect(parsed.context).toBe('http');
      expect(parsed.method).toBe('GET');
      expect(parsed.url).toBe('/claims');
      expect(parsed.status).toBe('success');

      done();
    });
  });

  it('should log RPC request success', (done) => {
    const context = mockRpcContext();

    const next: CallHandler = {
      handle: () => of({}),
    };

    const logSpy = jest
      .spyOn((interceptor as any).logger, 'log')
      .mockImplementation();

    interceptor.intercept(context, next).subscribe(() => {
      expect(logSpy).toHaveBeenCalled();

      const parsed = JSON.parse(logSpy.mock.calls[0][0]);

      expect(parsed.context).toBe('rpc');
      expect(parsed.method).toBe('getClaims');
      expect(parsed.payload).toEqual({ limit: 10 });
      expect(parsed.status).toBe('success');

      done();
    });
  });

  it('should log error when request fails', (done) => {
    const context = mockHttpContext();

    const next: CallHandler = {
      handle: () => throwError(() => new Error('Test error')),
    };

    const errorSpy = jest
      .spyOn((interceptor as any).logger, 'error')
      .mockImplementation();

    interceptor.intercept(context, next).subscribe({
      error: () => {
        expect(errorSpy).toHaveBeenCalled();

        const parsed = JSON.parse(errorSpy.mock.calls[0][0]);

        expect(parsed.status).toBe('error');
        expect(parsed.error).toBe('Test error');

        done();
      },
    });
  });
});
