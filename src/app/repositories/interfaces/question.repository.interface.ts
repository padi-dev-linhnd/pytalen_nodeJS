import { Model } from 'sequelize'
import { BaseRepositoryInterface } from './base.repository.interface'

export interface QuestionRepositoryInterface<M extends Model> extends BaseRepositoryInterface {
  generate_question(dataReq: any, accessToken: any): Promise<M>

  question_answer(dataReq: any): Promise<M>
}
