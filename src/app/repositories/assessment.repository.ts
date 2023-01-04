import Assessment from '@models/entities/assessment.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { AssessmentRepositoryInterface } from './interfaces/assessment.repository.interface'
import { ModelContainer } from '@decorators/model.decorator'
import jwt, { Secret, JwtPayload } from 'jsonwebtoken'
import Hr from '@models/entities/hr.entity'
import Assessment_gametype from '@models/entities/assessment_gametype.entity'
import Candidate from '@models/entities/candidate.entity'
import {
  check_assessment,
  check_gametype_assessment,
  format_datagametype,
  format_dataReq_hr,
} from '@service/all_service.service'

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

  async create_Assessment(dataReq: any, accessToken: any): Promise<any> {
    const dataGametype: any = Array.from(new Set(dataReq.Game_type))
    delete dataReq.Game_type

    const dataformat = format_dataReq_hr(dataReq, accessToken)
    if (typeof dataformat === 'string') return dataformat

    const dataAssessment: any = await check_assessment(dataReq)
    if (typeof dataAssessment === 'string') return dataAssessment

    const datagametype: any = await check_gametype_assessment(dataGametype, dataReq)
    if (typeof datagametype === 'string') return datagametype

    this.create(dataReq)
    const assessment_id: any = (await this.findByCondition({ where: dataReq })).id

    format_datagametype(dataGametype, assessment_id)
    Assessment_gametype.bulkCreate(dataGametype)
    delete dataReq.hr_id
    return dataReq
  }

  async getAssessmentCandidate(token: any): Promise<Assessment> {
    const data_andidate: any = jwt.verify(token, process.env.JWT_SECRET)

    const data_assessment: any = await this.getAllWhere({
      attributes: ['id', 'name', 'position', 'start_date', 'end_date'],
      include: [
        {
          model: Candidate,
          where: { id: data_andidate.id },
          attributes: ['id', 'email'],
        },
        {
          model: Hr,
          attributes: ['id', 'user_name'],
        },
      ],
      nest: true,
      raw: true,
    })
    data_assessment.forEach((item) => {
      delete item.Candidate.Invite
    })
    return data_assessment
  }
}

export default AssessmentRepository
