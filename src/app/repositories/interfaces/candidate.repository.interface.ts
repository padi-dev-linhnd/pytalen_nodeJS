import { Model } from 'sequelize'
import { BaseRepositoryInterface } from './base.repository.interface'

export interface CandidateRepositoryInterface<M extends Model> extends BaseRepositoryInterface {}
