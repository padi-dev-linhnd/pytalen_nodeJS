import Assessment from '@models/entities/assessment.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { AssessmentRepositoryInterface } from './interfaces/assessment.repository.interface'
import { ModelContainer } from '@decorators/model.decorator'
import jwt, { Secret, JwtPayload } from 'jsonwebtoken'
const { Op } = require('sequelize')
import Gametype from '@models/entities/gametype.entity'
import Hr from '@models/entities/hr.entity'
import Assessment_gametype from '@models/entities/assessment_gametype.entity'

@Service({ global: true })
class AssessmentRepository
  extends BaseRepository<Assessment>
  implements AssessmentRepositoryInterface<Assessment>
{
  constructor(@ModelContainer(Assessment.tableName) Assessment: ModelCtor<Assessment>) {
    super(Assessment)
  }

  async get_list_assessment(accessToken: any): Promise<any> {
    const dataHr: any = jwt.verify(accessToken, process.env.JWT_SECRET)
    if (dataHr.role == 'admin') {
      return this.getAllWhere({
        raw: true,
        nest: true,
        attributes: ['id', 'name', 'position', 'start_date', 'end_date'],
      })
    }
    const dataAssessment: any = await this.getAllWhere({
      where: {
        hr_id: dataHr.id,
      },
      attributes: ['id', 'name', 'position', 'start_date', 'end_date'],
      raw: true,
      nest: true,
    })
    return dataAssessment
  }

  async create_Assessment(dataReq: any): Promise<Assessment> {
    const dataGametype: any = dataReq.Game_type
    delete dataReq.Game_type
    const dataAssessment: any = await this.findByCondition({
      where: {
        name: dataReq.name,
        hr_id: dataReq.hr_id,
      },
    })
    if (dataAssessment) {
      return null
    }
    const datagametype: any = await Gametype.findAll({
      where: {
        id: {
          [Op.or]: dataGametype,
        },
      },
      raw: true,
      nest: true,
      include: {
        model: Hr,
        where: {
          id: dataReq.hr_id,
        },
      },
    })
    if (dataGametype.length != datagametype.length) {
      return undefined
    }
    this.create(dataReq)
    const assessment_id: any = (await this.findByCondition({ where: dataReq })).id
    dataGametype.map((item, index) => {
      dataGametype[index] = {
        assessment_id: assessment_id,
        gametype_id: item,
      }
    })
    Assessment_gametype.bulkCreate(dataGametype)
    delete dataReq.hr_id
    return dataReq
  }
}

export default AssessmentRepository
