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
      if (dataAdmin == null) {
        return this.setErrors(401, 'wrong username or password', res)
      }
      return this.setData(dataAdmin).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
