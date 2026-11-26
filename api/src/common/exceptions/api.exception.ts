import { HttpException } from '@nestjs/common';

export class ApiException extends HttpException {
  constructor(status: number, code: string, message: string, details: any = null) {
    super({ code, message, details }, status);
  }
}
