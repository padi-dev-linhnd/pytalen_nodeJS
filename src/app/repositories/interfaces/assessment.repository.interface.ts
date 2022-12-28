import { Model } from 'sequelize'
import { BaseRepositoryInterface } from './base.repository.interface'

export interface AssessmentRepositoryInterface<M extends Model> extends BaseRepositoryInterface {
  create_Assessment(dataReq: any): Promise<M>
  get_list_assessment(accessToken: any): Promise<M>
}