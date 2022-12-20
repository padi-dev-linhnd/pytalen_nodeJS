import { Model } from 'sequelize'
import { BaseRepositoryInterface } from './base.repository.interface'

export interface UserRepositoryInterface<M extends Model> extends BaseRepositoryInterface {
  findByEmail(email: string): Promise<M>
}
