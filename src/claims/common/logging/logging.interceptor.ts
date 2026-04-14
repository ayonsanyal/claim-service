import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('APP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const requestId = Math.random().toString(36).substring(7);
    const timestamp = new Date().toISOString();

    const contextType = context.getType<'http' | 'rpc'>();

    // Default
    const baseLog: any = {
      requestId,
      timestamp,
      context: contextType,
    };

    if (contextType === 'http') {
      const req = context.switchToHttp().getRequest();

      baseLog.method = req.method;
      baseLog.url = req.url;
    }

    if (contextType === 'rpc') {
      const rpc = context.switchToRpc();
      const data = rpc.getData();

      baseLog.method = context.getHandler().name;
      baseLog.payload = data;
    }

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - now;

          const successLog = {
            ...baseLog,
            duration: `${duration}ms`,
            status: 'success',
          };

          this.logger.log(JSON.stringify(successLog));
        },

        error: (err) => {
          const duration = Date.now() - now;

          const errorLog = {
            ...baseLog,
            duration: `${duration}ms`,
            status: 'error',
            error: err.message,
          };

          this.logger.error(JSON.stringify(errorLog));
        },
      }),
    );
  }
}
