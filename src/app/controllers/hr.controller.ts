import { Get, JsonController, Req, Res, UseBefore, Post } from 'routing-controllers'
import { NextFunction } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import HrRepository from '@repositories/hr.repository'
import { AdminMiddleware } from '@middlewares/check_Admin.middleware'
import { HrMiddleware } from '@middlewares/check_Hr.middleware'

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
      if (typeof dataHr == 'string') {
        return this.setErrors(400, dataHr, res)
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
      const dataReq: any = req.body

      const dataInvite = await this.hrRepository.invite_candidate(dataReq, accessToken)

      if (typeof dataInvite == 'string') {
        return this.setErrors(400, dataInvite, res)
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
      if (typeof dataHr == 'string') {
        return this.setErrors(400, dataHr, res)
      }
      return this.setData(dataHr).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
