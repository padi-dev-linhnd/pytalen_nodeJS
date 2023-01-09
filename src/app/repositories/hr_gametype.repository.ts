import Hr_gametype from '@models/entities/hrgametype.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { HRGametypeRepositoryInterface } from './interfaces/hr_gametype.repository.interface'
import { ModelContainer } from '@decorators/model.decorator'

@Service({ global: true })
class HrGametypeRepository
  extends BaseRepository<Hr_gametype>
  implements HRGametypeRepositoryInterface<Hr_gametype>
{
  constructor(@ModelContainer(Hr_gametype.tableName) Hr_gametype: ModelCtor<Hr_gametype>) {
    super(Hr_gametype)
  }
}

export default HrGametypeRepository
