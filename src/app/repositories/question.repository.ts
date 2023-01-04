import Question from '@models/entities/question.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { QuestionRepositoryInterface } from './interfaces/question.repository.interface'
import { ModelContainer } from '@decorators/model.decorator'
import Sequelize from 'sequelize'
const { Op } = require('sequelize')
import Result from '@models/entities/result.entity'
import {
  format_dataReq_candidate,
  check_assessment_gametype,
  check_assessment_candidate,
  check_result,
  format_question,
  check_result_full,
} from '@service/all_service.service'

@Service({ global: true })
class QuestionRepository
  extends BaseRepository<Question>
  implements QuestionRepositoryInterface<Question>
{
  constructor(@ModelContainer(Question.tableName) Question: ModelCtor<Question>) {
    super(Question)
  }

  async generate_question(dataReq: any, accessToken: any): Promise<any> {
    format_dataReq_candidate(dataReq, accessToken)
    const check1 = await check_assessment_gametype(dataReq.gametype_id, dataReq.assessment_id)
    if (check1 == false) return 'gametype va assessment nhap khong dung id'
    const check2 = await check_assessment_candidate(dataReq.assessment_id, dataReq.candidate_id)
    if (check2 == false) return 'candidate khong duoc moi vao assessment nay'
    const check4 = await check_result_full(dataReq)
    if (typeof check4 === 'string') return check4
    const check3 = await check_result(dataReq)
    if (check3 != -1) {
      const data_question: any = await this.findByCondition({
        where: { id: check3 },
        raw: true,
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      })
      return format_question(data_question)
    }
    const data_question: any = await this.getAllWhere({
      order: Sequelize.literal('random()'),
      limit: 1,
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      where: {
        id: {
          [Op.or]: [1, 2, 22, 21],
        },
        gametype_id: dataReq.gametype_id,
      },
      raw: true,
      nest: true,
    })
    await format_question(data_question[0])
    dataReq.question_id = data_question[0].id
    await Result.create(dataReq)
    return data_question
  }

  async question_answer(dataReq: any): Promise<any> {}
}

export default QuestionRepository
