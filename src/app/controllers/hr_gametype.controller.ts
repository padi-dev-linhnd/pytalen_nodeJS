import { JsonController } from 'routing-controllers'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import HrGametypeRepository from '@repositories/hr_gametype.repository'

@JsonController('/hr_gametype')
@Service()
export class HrGametypeController extends BaseController {
  constructor(protected hrGametypeRepository: HrGametypeRepository) {
    super()
  }

  //   OKE
  async bulkCreate(data) {
    try {
      await this.hrGametypeRepository.bulkcreate(data)
    } catch (error) {
      return this.setMessage('Error')
    }
  }
}
