import { Get, JsonController, Req, Res } from 'routing-controllers'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import ResultRepository from '@repositories/result.ropository'
const { Op } = require('sequelize')

import Gametype from '@models/entities/gametype.entity'
import Question from '@models/entities/question.entity'
import Answer from '@models/entities/answer.entity'

@JsonController('/result')
@Service()
export class ResultController extends BaseController {
  constructor(protected resultRepository: ResultRepository) {
    super()
  }

  // OKE
  async get_data_result_question(dataReq) {
    try {
      const data = await this.resultRepository.getAllWhere({
        where: {
          gametype_id: dataReq.gametype_id,
          candidate_id: dataReq.candidate_id,
          assessment_id: dataReq.assessment_id,
          answer: {
            [Op.ne]: null,
          },
        },
        include: [{ model: Gametype, attributes: ['total_time'] }, Question],
        raw: true,
        nest: true,
      })
      return data
    } catch (error) {
      return this.setMessage('Error')
    }
  }

  // OKE
  async get_list_question_id_and_total_point(dataReq) {
    try {
      let total_points = 0
      const list_question_id = []
      const data: any = await this.resultRepository.getAllWhere({
        where: {
          gametype_id: dataReq.gametype_id,
          assessment_id: dataReq.assessment_id,
          candidate_id: dataReq.candidate_id,
        },
        attributes: ['assessment_id', 'question_id', 'point', 'gametype_id'],
        raw: true,
      })
      if (data.length == 0) {
        data.push({
          list_question_id: list_question_id,
          total_points: 0,
        })
      } else {
        data.map((item) => {
          list_question_id.push(item.question_id)
          total_points += item.point
          delete item.point
        })
        delete data[0].question_id
        data[0].list_question_id = list_question_id
        data[0].total_points = total_points
      }
      return data[0]
    } catch (error) {
      return this.setMessage('Error')
    }
  }

  // OKE
  async get_question_answer_null(dataReq) {
    try {
      const data: any = await this.resultRepository.getAllWhere({
        where: {
          gametype_id: dataReq.gametype_id,
          candidate_id: dataReq.candidate_id,
          assessment_id: dataReq.assessment_id,
          answer: null,
        },
        raw: true,
        nest: true,
        include: [
          Gametype,
          {
            model: Question,
            include: [Answer],
            attributes: ['id', 'gametype_id', 'question', 'point', 'level'],
            nest: true,
          },
        ],
      })
      return data
    } catch (error) {
      return this.setMessage('Error')
    }
  }

  // OKE
  async update(data, where) {
    try {
      this.resultRepository.update(data, where)
    } catch (error) {
      return this.setMessage('Error')
    }
  }

  // OKE
  async create(data) {
    try {
      this.resultRepository.create(data)
    } catch (error) {
      return this.setMessage('Error')
    }
  }
}
