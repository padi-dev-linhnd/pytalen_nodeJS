import { Get, JsonController, Req, Res, UseBefore, Post } from 'routing-controllers'
import { NextFunction } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import HrRepository from '@repositories/hr.repository'
import { AdminMiddleware } from '@middlewares/check_Admin.middleware'
import { HttpException } from '@exceptions/http.exception'
import HrGameType from '@models/entities/hrgametype.entity'

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
      const findAllHrData = await this.hrRepository.getAll()
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
      const dataGame = dataReq.list
      delete dataReq.list
      const dataHr = await this.hrRepository.findByEmail(dataReq.email)
      if (dataHr) {
        return res.send({
          status: false,
          code: 401,
          message: 'Email already exists',
        })
      }
      await this.hrRepository.create(dataReq)
      const hr_id = (await this.hrRepository.findByEmail(dataReq.email)).id
      dataGame.map((item) => {
        item.hr_id = hr_id
        item.gametype_id = item.gametype_id
      })
      await HrGameType.bulkCreate(dataGame)
      return this.setData(undefined).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  @Post('/login')
  async Hr_login(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const dataReq = req.body
      if (dataReq.email && dataReq.password) {
        const dataHr = await this.hrRepository.User_Login(dataReq)
        return this.setData(dataHr).setMessage('Success').responseSuccess(res)
      }
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  @Post('/logout')
  async Hr_logout(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const bearer = req.headers.authorization
      if (!bearer || !bearer.startsWith('Bearer ')) {
        return next(new HttpException(401, 'not find bearer'))
      }
      const accessToken = bearer.split('Bearer ')[1].trim()
      const data = await this.hrRepository.User_Logout(accessToken)
      if (data[0] == 0) {
        return this.setData(undefined).setMessage('token does not exist').responseSuccess(res)
      }
      return this.setData(undefined).setMessage('successful logout').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
