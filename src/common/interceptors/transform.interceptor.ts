import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;
    const handler = context.getHandler();
    const isFreeResponse = this.reflector.get('isFreeResponse', handler);
    return next.handle().pipe(
      map((response) => {
        if (!isFreeResponse) {
          return {
            status: statusCode,
            ...(typeof response !== 'object' || Array.isArray(response)
            ? { response }
            : response),
          };
        } else {
          return response;
        }
      }),
    );
  }
}
