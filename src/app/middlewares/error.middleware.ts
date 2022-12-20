import { HttpException } from '@exceptions/http.exception'
import { NextFunction, Request, Response } from 'express'
import { env } from '@env'
import { ApiResponse } from '@interfaces/response.interface'

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  const code = error.status || 500
  const message = error.message || 'Something Wrong'

  const result: ApiResponse = {
    status: false,
    code: code,
    message: message,
    data: {},
  }
  const stack = error.stack
  if (env.node == 'development') return res.status(code).send({ ...result, stack })
  return res.status(code).send(result)
}

export default errorMiddleware
