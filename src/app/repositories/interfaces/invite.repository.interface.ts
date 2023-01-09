import { Model } from 'sequelize'
import { BaseRepositoryInterface } from './base.repository.interface'

export interface InviteRepositoryInterface<M extends Model> extends BaseRepositoryInterface {}
