import Hr from '@models/entities/hr.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { HrRepositoryInterface } from './interfaces/hr.repository.interface'
import { ModelContainer } from '@decorators/model.decorator'
import HrGameType from '@models/entities/hrgametype.entity'

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

  async create_Hr(dataReq: any): Promise<Hr> {
    const dataGame = dataReq.Game_type
    delete dataReq.Game_type
    const dataHr = await this.findByEmail(dataReq.email)
    if (dataHr) {
      return null
    }
    await this.create(dataReq)
    const hr_id = (await this.findByEmail(dataReq.email)).id
    dataGame.map((item) => {
      item.hr_id = hr_id
      item.gametype_id = item.gametype_id
    })
    await HrGameType.bulkCreate(dataGame)
    return dataReq
  }
}

export default HrRepository
