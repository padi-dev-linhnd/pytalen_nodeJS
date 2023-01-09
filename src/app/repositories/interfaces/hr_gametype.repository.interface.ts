import { Model } from 'sequelize'
import { BaseRepositoryInterface } from './base.repository.interface'

export interface HRGametypeRepositoryInterface<M extends Model> extends BaseRepositoryInterface {}
