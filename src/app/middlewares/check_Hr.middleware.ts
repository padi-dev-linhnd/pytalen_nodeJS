import { Get, Post, JsonController, Req, Res } from 'routing-controllers'
import { NextFunction } from 'express'
import { ExpressMiddlewareInterface } from 'routing-controllers'
import { Service } from 'typedi'
import { HttpException } from '@exceptions/http.exception'
import jwt, { Secret, JwtPayload } from 'jsonwebtoken'

@Service()
export class HrMiddleware implements ExpressMiddlewareInterface {
  // interface implementation is optional
  async use(@Req() req: any, @Res() res: any, next: NextFunction): Promise<any> {
    const bearer = req.headers.authorization
    if (!bearer || !bearer.startsWith('Bearer ')) {
      return next(new HttpException(401, 'Unauthorised'))
    }
    const accessToken = bearer.split('Bearer ')[1].trim()
    try {
      const dataHr: any = jwt.verify(accessToken, process.env.JWT_SECRET)
      if (dataHr.role == 'admin') {
        return next()
      }
      if (dataHr.role != 'hr') {
        return next(new HttpException(401, 'Not hr'))
      }
      return next()
    } catch (error) {
      return next(new HttpException(401, 'Unauthorised'))
    }
  }
}
