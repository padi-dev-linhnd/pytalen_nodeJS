import { Model } from 'sequelize'
import { BaseRepositoryInterface } from './base.repository.interface'

export interface AdminRepositoryInterface<M extends Model> extends BaseRepositoryInterface {
  findByEmail(email: string): Promise<M>
  AdminLogin(dataReq: object): Promise<M>
  AdminLogout(accessToken: string): Promise<M>
}
