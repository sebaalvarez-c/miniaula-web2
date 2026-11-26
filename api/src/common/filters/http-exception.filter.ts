import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse() as any;
      const code = typeof res === 'object' ? (res.code || res.error || 'ERROR') : 'ERROR';
      const message = typeof res === 'object' ? (res.message || exception.message) : exception.message;
      const details = typeof res === 'object' ? (res.details ?? null) : null;

      return response.status(status).json({ error: { code, message, details } });
    }

    console.error(exception);
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error', details: null },
    });
  }
}
