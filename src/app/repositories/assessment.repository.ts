import Assessment from '@models/entities/assessment.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { AssessmentRepositoryInterface } from './interfaces/assessment.repository.interface'
import { ModelContainer } from '@decorators/model.decorator'
import jwt, { Secret, JwtPayload } from 'jsonwebtoken'

import Assessment_gametypes_question from '@models/entities/assessment_gametypes_question.entity'
import Answer from '@models/entities/answer.entity'
import Question from '@models/entities/question.entity'
import Sequelize from 'sequelize'

@Service({ global: true })
class AssessmentRepository
  extends BaseRepository<Assessment>
  implements AssessmentRepositoryInterface<Assessment>
{
  constructor(@ModelContainer(Assessment.tableName) Assessment: ModelCtor<Assessment>) {
    super(Assessment)
  }

  async get_list_assessment(accessToken: any): Promise<Assessment> {
    const dataHr: any = jwt.verify(accessToken, process.env.JWT_SECRET)
    const dataAssessment: any = await this.getAllWhere({
      where: {
        hr_id: dataHr.id,
      },
      attributes: ['name', 'position', 'start_date', 'end_date'],
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
    await this.create(dataReq)
    const assessment_id = (
      await this.findByCondition({
        where: {
          name: dataReq.name,
          hr_id: dataReq.hr_id,
        },
      })
    ).id
    dataGametype.forEach(async (item) => {
      if (item.gametype_id == 2) {
        for (let i = 0; i <= 1; i++) {
          const dataQuestion: any = await Question.findAll({
            order: Sequelize.literal('random()'),
            limit: 5,
            include: {
              model: Answer,
              where: { answer: 'dung', correct_answer: i },
              attributes: {
                exclude: ['password', 'createdAt', 'updatedAt'],
              },
            },
            attributes: ['id', 'gametype_id'],
            where: {
              gametype_id: item.gametype_id,
            },
            raw: true,
            nest: true,
          })
          dataQuestion.map((item) => {
            item.question_id = item.id
            item.gametype_id = item.gametype_id
            item.assessment_id = assessment_id
            delete item.Answer
            delete item.id
          })
          await Assessment_gametypes_question.bulkCreate(dataQuestion)
        }
      }

      if (item.gametype_id == 1) {
        for (let i = 1; i <= 10; i++) {
          const dataQuestion: any = await Question.findAll({
            order: Sequelize.literal('random()'),
            limit: 1,
            attributes: ['id', 'gametype_id'],
            where: {
              level: i,
            },
            raw: true,
            nest: true,
          })
          dataQuestion.map((item) => {
            item.question_id = item.id
            item.gametype_id = item.gametype_id
            item.assessment_id = assessment_id
            delete item.id
          })
          await Assessment_gametypes_question.bulkCreate(dataQuestion)
        }
      }
    })
    return dataReq
  }
}

export default AssessmentRepository
