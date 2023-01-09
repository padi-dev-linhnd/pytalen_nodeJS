import { Model } from 'sequelize'
import { BaseRepositoryInterface } from './base.repository.interface'

export interface HrRepositoryInterface<M extends Model> extends BaseRepositoryInterface {
  findByEmail(email: string): Promise<M>
}
