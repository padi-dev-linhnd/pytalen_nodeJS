import Gametype from '@models/entities/gametype.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { GametypeRepositoryInterface } from './interfaces/gametype.repository.interface'
import jwt, { Secret, JwtPayload } from 'jsonwebtoken'
import { ModelContainer } from '@decorators/model.decorator'
import Assessment from '@models/entities/assessment.entity'
import Hr from '@models/entities/hr.entity'
import { check_assessment_candidate } from '@service/all_service.service'

@Service({ global: true })
class GametypeRepository
  extends BaseRepository<Gametype>
  implements GametypeRepositoryInterface<Gametype>
{
  constructor(@ModelContainer(Gametype.tableName) Gametype: ModelCtor<Gametype>) {
    super(Gametype)
  }

  async getGametype(accessToken: any): Promise<any> {
    const dataHr: any = jwt.verify(accessToken, process.env.JWT_SECRET)
    if (dataHr.role == 'admin') {
      return this.getAllWhere({
        raw: true,
        nest: true,
        attributes: ['name', 'total_time', 'time_question', 'total_question'],
      })
    }
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
    dataGametype.forEach((item) => {
      delete item.Hr
    })
    return dataGametype
  }

  async generate_gametype(params: any, accessToken: any): Promise<any> {
    const data_candidate: any = jwt.verify(accessToken, process.env.JWT_SECRET)
    const data_check = await check_assessment_candidate(data_candidate.id, params.assessment_id)
    if (data_check == false) return 'ban khong co quyen vao Assessment nay'
    const data_gametype: any = await this.getAllWhere({
      include: {
        model: Assessment,
        where: {
          id: params.assessment_id,
        },
      },
      attributes: ['id', 'name', 'total_time', 'time_question', 'total_question'],
      raw: true,
      nest: true,
    })
    data_gametype.map((item) => {
      delete item.Assessment
    })
    return data_gametype
  }
}

export default GametypeRepository
