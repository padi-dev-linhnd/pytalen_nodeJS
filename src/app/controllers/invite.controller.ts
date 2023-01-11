import { Get, JsonController, Req, Res } from 'routing-controllers'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import InviteRepository from '@repositories/invite.repository'
import Sequelize from 'sequelize'

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

  //   OKE
  async get_num_candidate_invited(assessment_id) {
    try {
      const data: any = await this.inviteRepository.getAllWhere({
        where: { assessment_id: assessment_id },
        attributes: [[Sequelize.fn('COUNT', 'candidate_id'), 'total_candidate']],
        group: ['assessment_id'],
        nest: true,
        raw: true,
      })
      if (data.length == 0) {
        return 0
      }
      return data[0].total_candidate
    } catch (error) {
      return this.setMessage('Error')
    }
  }
}
