import { Get, JsonController, Req, Res } from 'routing-controllers'
import { NextFunction } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import UserRepository from '@repositories/user.repository'

@JsonController('/user')
@Service()
export class UsersController extends BaseController {
  constructor(protected userRepository: UserRepository) {
    super()
  }

  // OKE
  @Get('/list')
  async getUser(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const findAllUsersData = await this.userRepository.getAll()
      return this.setData(findAllUsersData).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
