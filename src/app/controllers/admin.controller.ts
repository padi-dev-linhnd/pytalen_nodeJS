import { Post, JsonController, Req, Res } from 'routing-controllers'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import AdminRepository from '@repositories/admin.repository'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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

      const data_admin = await this.adminRepository.findByCondition({
        where: { email: dataReq.email },
        attributes: ['id', 'email', 'role', 'password'],
        raw: true,
      })

      if (
        data_admin == null ||
        bcrypt.compareSync(dataReq.password, data_admin.password) == false
      ) {
        return res.status(400).json({ status: 400, message: 'sai ten dang nhap hoac mat khau' })
      }

      return this.setData(jwt.sign(data_admin, process.env.JWT_SECRET))
        .setMessage('Success')
        .responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
