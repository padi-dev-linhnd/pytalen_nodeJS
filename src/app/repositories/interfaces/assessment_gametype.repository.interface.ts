import { Model } from 'sequelize'
import { BaseRepositoryInterface } from './base.repository.interface'

export interface AssessmentGametypeRepositoryInterface<M extends Model>
  extends BaseRepositoryInterface {}
