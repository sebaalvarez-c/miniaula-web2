import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Error interno del servidor' };

    let message = 'Error inesperado';
    let details: any[] = [];

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const resObj = exceptionResponse as any;
      if (Array.isArray(resObj.message)) {
        message = 'Error de validación';
        details = resObj.message;
      } else {
        message = resObj.message || message;
        details = Array.isArray(resObj.details) ? resObj.details : [];
      }
    }

    response.status(status).json({
      error: {
        code: status,
        message,
        details,
      },
    });
  }
}