import { Model } from 'sequelize'
import { BaseRepositoryInterface } from './base.repository.interface'

export interface HrRepositoryInterface<M extends Model> extends BaseRepositoryInterface {
  findByEmail(email: string): Promise<M>
  create_Hr(dataReq: any): Promise<M>
  invite_candidate(dataReq: any, accessToken: any): Promise<M>
}
