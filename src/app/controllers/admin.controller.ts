import { Post, JsonController, Req, Res } from 'routing-controllers'
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
  async Admin_login(@Req() req: any, @Res() res: any) {
    try {
      const dataReq = req.body
      const dataAdmin = await this.adminRepository.User_Login(dataReq)
      if (typeof dataAdmin == 'string') {
        return this.setErrors(400, dataAdmin, res)
      }
      return this.setData(dataAdmin).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
