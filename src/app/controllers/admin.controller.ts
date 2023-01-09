import { Post, JsonController, Req, Res } from 'routing-controllers'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import AdminRepository from '@repositories/admin.repository'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { ValidateEmail } from '@service/base.services'

@JsonController('/admin')
@Service()
export class AdminController extends BaseController {
  constructor(protected adminRepository: AdminRepository) {
    super()
  }

  // OKE
  @Post('/login')
  async Admin_login(@Req() req: any, @Res() res: any) {
    try {
      const dataReq = req.body
      if (ValidateEmail([dataReq.email]) == false) {
        return this.setErrors(400, 'email not valid', res)
      }

      const data_admin = await this.adminRepository.findByCondition({
        where: { email: dataReq.email },
        attributes: ['id', 'email', 'role', 'password'],
        raw: true,
      })

      if (
        data_admin == null ||
        bcrypt.compareSync(dataReq.password, data_admin.password) == false
      ) {
        return this.setErrors(400, 'sai ten dang nhap hoac mat khau', res)
      }

      return this.setData(jwt.sign(data_admin, process.env.JWT_SECRET))
        .setMessage('Success')
        .responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
