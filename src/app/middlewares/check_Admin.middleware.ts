import { Get, Post, JsonController, Req, Res } from 'routing-controllers'
import { NextFunction } from 'express'
import { ExpressMiddlewareInterface } from 'routing-controllers'
import { Service } from 'typedi'
import { HttpException } from '@exceptions/http.exception'
import jwt, { Secret, JwtPayload } from 'jsonwebtoken'
import { ValidateEmail } from '@service/base.services'

@Service()
export class AdminMiddleware implements ExpressMiddlewareInterface {
  // interface implementation is optional
  async use(@Req() req: any, @Res() res: any, next: NextFunction): Promise<any> {
    const bearer = req.headers.authorization
    if (!bearer || !bearer.startsWith('Bearer ')) {
      return next(new HttpException(401, 'Unauthorised'))
    }
    const accessToken = bearer.split('Bearer ')[1].trim()
    try {
      const dataAdmin: any = jwt.verify(accessToken, process.env.JWT_SECRET)
      const dataReq = req.body
      dataReq.admin = dataAdmin.id
      if (dataAdmin.role != 'admin') {
        return next(new HttpException(401, 'Not admin'))
      }
      if (dataReq.email) {
        const data = ValidateEmail([dataReq.email])
        if (data == false) {
          return next(new HttpException(400, 'email khong hop le'))
        }
      }
      if (dataReq.list_email) {
        const data = ValidateEmail(dataReq.list_email)
        if (data == false) {
          return next(new HttpException(400, 'email khong hop le'))
        }
      }
      return next()
    } catch (error) {
      return next(new HttpException(401, 'Unauthorised'))
    }
  }
}
