import { Model } from 'sequelize'
import { BaseRepositoryInterface } from './base.repository.interface'

export interface AssessmentRepositoryInterface<M extends Model> extends BaseRepositoryInterface {}
