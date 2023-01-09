import { JsonController } from 'routing-controllers'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import AssessmentGametypeRepository from '@repositories/assessment_gametype.repository'

@JsonController('/assessment_gametype')
@Service()
export class AssessmentGametypeController extends BaseController {
  constructor(protected assessmentGametypeRepository: AssessmentGametypeRepository) {
    super()
  }

  //   OKE
  async bulkCreate(data) {
    try {
      await this.assessmentGametypeRepository.bulkcreate(data)
    } catch (error) {
      return this.setMessage('Error')
    }
  }
}
