import { Get, Post, JsonController, Req, Res, UseBefore } from 'routing-controllers'
import { NextFunction } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import AdminRepository from '@repositories/admin.repository'
@JsonController('/admin')
@Service()
export class AdminController extends BaseController {
  constructor(protected adminRepository: AdminRepository) {
    super()
  }

  @Post('/login')
  async Admin_login(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const dataReq = req.body
      const dataAdmin = await this.adminRepository.User_Login(dataReq)
      return this.setData(dataAdmin).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  @Post('/logout')
  async Admin_logout(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const bearer = req.headers.authorization
      if (!bearer || !bearer.startsWith('Bearer ')) {
        return this.setErrors(401, 'not bearer', res)
      }
      const accessToken = bearer.split('Bearer ')[1].trim()
      const data = await this.adminRepository.User_Logout(accessToken)
      if (data[0] == 0) {
        return this.setData(undefined).setMessage('token does not exist').responseSuccess(res)
      }
      return this.setData(undefined).setMessage('successful logout').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
