import { Get, JsonController, Req, Res } from 'routing-controllers'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import InviteRepository from '@repositories/invite.repository'

@JsonController('/invite')
@Service()
export class InviteController extends BaseController {
  constructor(protected inviteRepository: InviteRepository) {
    super()
  }

  //   OKE
  async findByCondition(data) {
    try {
      const datax = await this.inviteRepository.findByCondition(data)
      return datax
    } catch (error) {
      return this.setMessage('Error')
    }
  }

  //   OKE
  async create(data) {
    try {
      await this.inviteRepository.create(data)
    } catch (error) {
      return this.setMessage('Error')
    }
  }
}
