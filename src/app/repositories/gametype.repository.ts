import Gametype from '@models/entities/gametype.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { GametypeRepositoryInterface } from './interfaces/gametype.repository.interface'
import jwt, { Secret, JwtPayload } from 'jsonwebtoken'
import { ModelContainer } from '@decorators/model.decorator'
import Hr from '@models/entities/hr.entity'

@Service({ global: true })
class GametypeRepository
  extends BaseRepository<Gametype>
  implements GametypeRepositoryInterface<Gametype>
{
  constructor(@ModelContainer(Gametype.tableName) Gametype: ModelCtor<Gametype>) {
    super(Gametype)
  }

  async getGametypeByHr(accessToken: any): Promise<Gametype> {
    const dataHr: any = jwt.verify(accessToken, process.env.JWT_SECRET)
    const dataGametype: any = await this.getAllWhere({
      attributes: ['name', 'total_time', 'time_question', 'total_question'],
      include: {
        model: Hr,
        where: {
          id: dataHr.id,
        },
      },
      raw: true,
      nest: true,
    })
    dataGametype.map((item) => {
      delete item.Hr
    })
    return dataGametype
  }
}

export default GametypeRepository
