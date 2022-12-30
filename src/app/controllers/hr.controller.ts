import { Get, JsonController, Req, Res, UseBefore, Post } from 'routing-controllers'
import { NextFunction } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import HrRepository from '@repositories/hr.repository'
import { AdminMiddleware } from '@middlewares/check_Admin.middleware'
import { HrMiddleware } from '@middlewares/check_Hr.middleware'
import jwt, { Secret, JwtPayload } from 'jsonwebtoken'

@JsonController('/hr')
@Service()
export class HrController extends BaseController {
  constructor(protected hrRepository: HrRepository) {
    super()
  }

  @UseBefore(AdminMiddleware)
  @Get('/list')
  async getHr(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const findAllHrData = await this.hrRepository.getAllWhere({
        attributes: {
          exclude: ['password', 'token', 'createdAt', 'updatedAt'],
        },
      })
      return this.setData(findAllHrData).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  @UseBefore(AdminMiddleware)
  @Post('/create')
  async createHr(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const dataReq = req.body
      const dataHr = await this.hrRepository.create_Hr(dataReq)
      if (dataHr == null) {
        return this.setErrors(401, 'Email already exists', res)
      }
      return this.setData(dataHr).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  @UseBefore(HrMiddleware)
  @Post('/invite')
  async invite_cadidate(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const dataHr: any = jwt.verify(accessToken, process.env.JWT_SECRET)
      if (dataHr.role == 'admin') {
        return this.setErrors(401, 'you are admin', res)
      }
      const dataReq: any = req.body
      dataReq.hr_id = dataHr.id
      const dataInvite = await this.hrRepository.invite_candidate(dataReq)
      if (dataInvite == null) {
        return this.setErrors(
          401,
          'This Hr does not have the right to invite Candidate into this Assessment',
          res,
        )
      }
      return this.setData(dataInvite).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  @Post('/login')
  async Hr_login(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const dataReq = req.body
      const dataHr = await this.hrRepository.User_Login(dataReq)
      return this.setData(dataHr).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
