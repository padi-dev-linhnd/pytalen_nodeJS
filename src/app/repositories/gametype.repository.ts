import Gametype from '@models/entities/gametype.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { GametypeRepositoryInterface } from './interfaces/gametype.repository.interface'
import { ModelContainer } from '@decorators/model.decorator'

@Service({ global: true })
class GametypeRepository
  extends BaseRepository<Gametype>
  implements GametypeRepositoryInterface<Gametype>
{
  constructor(@ModelContainer(Gametype.tableName) Gametype: ModelCtor<Gametype>) {
    super(Gametype)
  }
}

export default GametypeRepository
