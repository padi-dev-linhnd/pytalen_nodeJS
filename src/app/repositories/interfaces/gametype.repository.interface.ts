import { Model } from 'sequelize'
import { BaseRepositoryInterface } from './base.repository.interface'

export interface GametypeRepositoryInterface<M extends Model> extends BaseRepositoryInterface {
  getGametype(accessToken: any): Promise<M>
}
