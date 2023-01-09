import { Get, Post, JsonController, Req, Res, UseBefore } from 'routing-controllers'
import { NextFunction } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import QuestionRepository from '@repositories/question.repository'
import { CandidateMiddleware } from '@middlewares/check_Candidate.middleware'
import jwt from 'jsonwebtoken'
const { Op } = require('sequelize')
import Sequelize from 'sequelize'
import Gametype from '@models/entities/gametype.entity'
import Answer from '@models/entities/answer.entity'
import Question from '@models/entities/question.entity'
import {
  format_data_question_gametype1_and_dataReq,
  format_data_question_gametype2_and_dataReq,
  format_data_question_gametype1,
  format_data_question_gametype2,
  time_used,
} from '@service/question.service'
import ResultRepository from '@repositories/result.ropository'
import Result from '@models/entities/result.entity'

@JsonController('/question')
@Service()
export class QuestionController extends BaseController {
  constructor(protected questionRepository: QuestionRepository) {
    super()
  }

  async get_data_result_question(dataReq) {
    try {
      const resultRepository = new ResultRepository(Result)
      const data = await resultRepository.getAllWhere({
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

  async check_question_result(dataReq) {
    try {
      const resultRepository = new ResultRepository(Result)
      const data = await resultRepository.getAllWhere({
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
      if (data.length > 0) {
        return data
      }
    } catch (error) {
      return this.setMessage('Error')
    }
  }

  async generate_question_gametype1(level: any) {
    try {
      const data_question = await this.questionRepository.getAllWhere({
        order: Sequelize.literal('random()'),
        limit: 1,
        where: {
          level: level,
        },
        include: [Answer, Gametype],
        raw: true,
        nest: true,
      })
      return data_question
    } catch (error) {
      return this.setMessage('Error')
    }
  }

  async get_num_question_true(list_question_id) {
    try {
      const data_question = await this.questionRepository.getAllWhere({
        where: {
          id: {
            [Op.or]: list_question_id,
          },
        },
        include: {
          model: Answer,
          where: {
            answer: 'dung',
            correct_answer: 1,
          },
        },
      })
      return data_question.length
    } catch (error) {
      return this.setMessage('Error')
    }
  }

  async generate_question_gametype2(list_question_id, dataReq) {
    try {
      let correct_answer = [1, 0]
      let num_question_false
      let num_question_true
      if (list_question_id.length == 0) {
        num_question_true = 0
        num_question_false = 0
      } else {
        num_question_true = await this.get_num_question_true(list_question_id)
        num_question_false = list_question_id.length - num_question_true
      }
      if (num_question_true > num_question_false) {
        correct_answer = [0]
      }
      if (num_question_true < num_question_false) {
        correct_answer = [1]
      }
      const data_question = await this.questionRepository.getAllWhere({
        order: Sequelize.literal('random()'),
        limit: 1,
        where: {
          id: { [Op.notIn]: list_question_id },
          gametype_id: dataReq.gametype_id,
        },
        attributes: ['id', 'gametype_id', 'question', 'point'],
        include: [
          {
            model: Answer,
            where: {
              answer: 'dung',
              correct_answer: { [Op.or]: correct_answer },
            },
          },
          Gametype,
        ],
        raw: true,
        nest: true,
      })
      return data_question
    } catch (error) {
      return this.setMessage('Error')
    }
  }

  async get_list_question_id_and_total_point(dataReq) {
    try {
      const resultRepository = new ResultRepository(Result)
      let total_points = 0
      const list_question_id = []
      const data: any = await resultRepository.getAllWhere({
        where: {
          gametype_id: dataReq.gametype_id,
          assessment_id: dataReq.assessment_id,
          candidate_id: dataReq.candidate_id,
        },
        attributes: ['assessment_id', 'question_id', 'point', 'gametype_id'],
        raw: true,
      })
      console.log(data)
      data.map((item) => {
        list_question_id.push(item.question_id)
        total_points += item.point
        delete item.point
      })
      delete data[0].question_id
      if (data.length == 0) {
        data.push({
          list_question_id: list_question_id,
          total_points: 0,
        })
      } else {
        data[0].list_question_id = list_question_id
        data[0].total_points = total_points
      }
      return data[0]
    } catch (error) {
      return this.setMessage('Error')
    }
  }

  async finish_game(dataReq) {
    try {
      const resultRepository = new ResultRepository(Result)
      await resultRepository.update(
        { answer: '', status: false, point: 0 },
        {
          where: {
            gametype_id: dataReq.gametype_id,
            assessment_id: dataReq.assessment_id,
            candidate_id: dataReq.candidate_id,
            answer: null,
          },
        },
      )
      const data = await this.get_list_question_id_and_total_point(dataReq)
      const data_question = await this.questionRepository.getAllWhere({
        where: {
          id: {
            [Op.or]: data.list_question_id,
          },
        },
        attributes: ['id', 'question'],
        include: [
          {
            model: Result,
            attributes: ['answer', 'point'],
          },
          {
            model: Result,
            where: {
              gametype_id: dataReq.gametype_id,
              assessment_id: dataReq.assessment_id,
              candidate_id: dataReq.candidate_id,
            },
            attributes: [],
          },
        ],
        raw: true,
        nest: true,
      })
      data.your_list_answer = data_question
      delete data.list_question_id
      return data
    } catch (error) {
      return this.setMessage('Error')
    }
  }

  @UseBefore(CandidateMiddleware)
  @Post('/generate')
  async generate_question(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const data_candidate: any = jwt.verify(accessToken, process.env.JWT_SECRET)
      const dataReq = req.body
      dataReq.candidate_id = data_candidate.id

      const data_result_question: any = await this.get_data_result_question(dataReq)
      if (data_result_question.length > 0) {
        if (
          data_result_question[data_result_question.length - 1].status == 0 &&
          dataReq.gametype_id == 1
        ) {
          return this.finish_game(dataReq)
        }
        if (data_result_question.length >= 10 && dataReq.gametype_id == 2) {
          return this.finish_game(dataReq)
        }
      }

      let time_remaining = 99
      const data_results: any = await this.get_list_question_id_and_total_point(dataReq)
      const data_result: any = await this.check_question_result(dataReq)
      if (data_result != undefined) {
        if (dataReq.gametype_id == 1) {
          time_remaining = data_result[0].Question.level * 20 - time_used(data_result[0].createdAt)
          format_data_question_gametype1(data_result, time_remaining, data_results)
        }
        if (dataReq.gametype_id == 2) {
          if (data_result_question.length > 0) {
            time_remaining =
              Number(data_result_question[0].Gametype.total_time) -
              time_used(data_result_question[0].createdAt)
          }
          format_data_question_gametype2(data_result, time_remaining, data_results)
        }
        if (time_remaining <= 0) {
          return this.finish_game(dataReq)
        }
        if (data_result_question.length == 0) {
          delete data_result[0].Question.time_remaining
        }
        return this.setData(data_result[0].Question).setMessage('Success').responseSuccess(res)
      }

      const resultRepository = new ResultRepository(Result)
      if (dataReq.gametype_id == 1) {
        const data_question_gametype1 = await this.generate_question_gametype1(1)
        format_data_question_gametype1_and_dataReq(
          data_question_gametype1[0],
          dataReq,
          data_results,
        )
        resultRepository.create(dataReq)
        return this.setData(data_question_gametype1[0]).setMessage('Success').responseSuccess(res)
      }
      if (dataReq.gametype_id == 2) {
        const data_question_gametype2 = await this.generate_question_gametype2([], dataReq)
        format_data_question_gametype2_and_dataReq(
          data_question_gametype2,
          dataReq,
          data_results,
          time_remaining,
        )
        delete data_question_gametype2[0].time_remaining
        resultRepository.create(dataReq)
        return this.setData(data_question_gametype2[0]).setMessage('Success').responseSuccess(res)
      }
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  async get_previous_question_point(dataReq) {
    try {
      const data_question: any = await this.questionRepository.findByCondition({
        where: {
          id: dataReq.question_id,
        },
        include: {
          model: Answer,
          where: {
            answer: dataReq.answer,
          },
        },
        raw: true,
        nest: true,
      })

      let status = false
      let point = 0
      if (data_question != null) {
        if (data_question.Answer.correct_answer != 0) {
          status = true
          point = data_question.point
        }
      }

      const data_update = {
        answer: dataReq.answer,
        status: status,
        point: point,
      }
      delete dataReq.answer

      const resultRepository = new ResultRepository(Result)
      resultRepository.update(data_update, { where: dataReq })

      return point
    } catch (error) {
      return this.setMessage('Error')
    }
  }

  @UseBefore(CandidateMiddleware)
  @Post('/answer')
  async question_answer(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const dataReq = req.body
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const data_hr: any = jwt.verify(accessToken, process.env.JWT_SECRET)
      dataReq.candidate_id = data_hr.id

      const data_result_question: any = await this.get_data_result_question(dataReq)
      if (data_result_question.length >= 10) {
        return this.finish_game(dataReq)
      }
      let time_remaining = 0
      if (data_result_question.length > 0) {
        if (dataReq.gametype_id == 2) {
          time_remaining =
            Number(data_result_question[0].Gametype.total_time) -
            time_used(data_result_question[0].createdAt)
          if (time_remaining <= 0) {
            return this.finish_game(dataReq)
          }
        }
      }

      const previous_question_point: any = await this.get_previous_question_point(dataReq)

      const resultRepository = new ResultRepository(Result)
      const data_results: any = await this.get_list_question_id_and_total_point(dataReq)
      if (dataReq.gametype_id == 1) {
        if (previous_question_point == 0) {
          return this.finish_game(dataReq)
        }
        const question_data: any = await this.generate_question_gametype1(
          previous_question_point + 1,
        )
        format_data_question_gametype1_and_dataReq(question_data[0], dataReq, data_results)
        question_data[0].previous_question_point = previous_question_point
        dataReq.question_id = question_data[0].id
        await resultRepository.create(dataReq)
        return this.setData(question_data[0]).setMessage('Success').responseSuccess(res)
      }
      if (dataReq.gametype_id == 2) {
        const question_data: any = await this.generate_question_gametype2(
          data_results.list_question_id,
          dataReq,
        )
        format_data_question_gametype2_and_dataReq(
          question_data,
          dataReq,
          data_results,
          time_remaining,
        )
        question_data[0].previous_question_point = previous_question_point
        dataReq.question_id = question_data[0].id
        await resultRepository.create(dataReq)
        return this.setData(question_data[0]).setMessage('Success').responseSuccess(res)
      }
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
