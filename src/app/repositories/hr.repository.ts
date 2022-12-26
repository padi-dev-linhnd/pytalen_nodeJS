import Hr from '@models/entities/hr.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { HrRepositoryInterface } from './interfaces/hr.repository.interface'
import { ModelContainer } from '@decorators/model.decorator'

@Service({ global: true })
class HrRepository extends BaseRepository<Hr> implements HrRepositoryInterface<Hr> {
  constructor(@ModelContainer(Hr.tableName) User: ModelCtor<Hr>) {
    super(User)
  }

  async findByEmail(email: string): Promise<Hr> {
    return this.findByCondition({
      where: { email: email },
    })
  }
}

export default HrRepository
