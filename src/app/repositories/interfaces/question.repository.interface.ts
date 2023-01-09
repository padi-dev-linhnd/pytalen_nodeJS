import { Model } from 'sequelize'
import { BaseRepositoryInterface } from './base.repository.interface'

export interface QuestionRepositoryInterface<M extends Model> extends BaseRepositoryInterface {}
