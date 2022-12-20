import { Get, Post, JsonController, Req, Res } from 'routing-controllers'
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
  async getAdmin(@Req() req: any, @Res() res: any, next: NextFunction) {
    const dataReq = req.body
    try {
      const findAllAdminsData = await this.adminRepository.checkLogin(dataReq)
      console.log('abc', findAllAdminsData)
      return this.setData(findAllAdminsData).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
