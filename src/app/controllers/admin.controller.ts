import { Get, Post, JsonController, Req, Res, UseBefore } from 'routing-controllers'
import { NextFunction } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import AdminRepository from '@repositories/admin.repository'
import { HttpException } from '@exceptions/http.exception'
import { AdminMiddleware } from '@middlewares/check_Admin.middleware'
@JsonController('/admin')
@Service()
export class AdminController extends BaseController {
  constructor(protected adminRepository: AdminRepository) {
    super()
  }

  @Post('/login')
  async Admin_login(@Req() req: any, @Res() res: any, next: NextFunction) {
    const dataReq = req.body
    try {
      const dataAdmin = await this.adminRepository.AdminLogin(dataReq)
      return this.setData(dataAdmin).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
  @UseBefore(AdminMiddleware)
  @Post('/logout')
  async Admin_logout(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const bearer = req.headers.authorization
      if (!bearer || !bearer.startsWith('Bearer ')) {
        return next(new HttpException(401, 'not find bearer'))
      }
      const accessToken = bearer.split('Bearer ')[1].trim()
      const data = await this.adminRepository.AdminLogout(accessToken)
      if (data[0] == 0) {
        return this.setData(undefined).setMessage('token does not exist').responseSuccess(res)
      }
      return this.setData(undefined).setMessage('successful logout').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
