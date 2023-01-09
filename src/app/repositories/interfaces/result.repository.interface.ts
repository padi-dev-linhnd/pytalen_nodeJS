import { Model } from 'sequelize'
import { BaseRepositoryInterface } from './base.repository.interface'

export interface ResultRepositoryInterface<M extends Model> extends BaseRepositoryInterface {}
