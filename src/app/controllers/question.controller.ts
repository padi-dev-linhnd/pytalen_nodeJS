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
import {
  format_data_question_gametype1_and_dataReq,
  format_data_question_gametype2_and_dataReq,
  format_data_question_gametype1,
  format_data_question_gametype2,
  time_used,
} from '@service/question.service'

import { ResultController } from './result.controller'
import ResultRepository from '@repositories/result.ropository'
import Result from '@models/entities/result.entity'

@JsonController('/question')
@Service()
export class QuestionController extends BaseController {
  constructor(protected questionRepository: QuestionRepository) {
    super()
  }

  // OKE
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

  // OKE
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

  // OKE
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

  // OKE
  async finish_game(dataReq) {
    try {
      const resultController = new ResultController(new ResultRepository(Result))
      await resultController.update(
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
      const data = await resultController.get_list_question_id_and_total_point(dataReq)
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

  // OKE
  @UseBefore(CandidateMiddleware)
  @Post('/generate')
  async generate_question(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const data_candidate: any = jwt.verify(accessToken, process.env.JWT_SECRET)
      const dataReq = req.body
      dataReq.candidate_id = data_candidate.id

      const resultController = new ResultController(new ResultRepository(Result))
      const data_result_question: any = await resultController.get_data_result_question(dataReq)
      if (data_result_question.length >= Number(process.env.num_question)) {
        return this.finish_game(dataReq)
      }

      let time_remaining = 100
      const data_results: any = await resultController.get_list_question_id_and_total_point(dataReq)
      const data_result: any = await resultController.get_question_answer_null(dataReq)

      if (data_result_question.length > 0 && data_result == 0) {
        return this.finish_game(dataReq)
      }

      if (data_result.length > 0) {
        if (dataReq.gametype_id == 1) {
          time_remaining =
            data_result[0].Question.level * Number(process.env.time_question1) -
            time_used(data_result[0].createdAt)
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

      if (dataReq.gametype_id == 1) {
        const data_question_gametype1 = await this.generate_question_gametype1(1)
        format_data_question_gametype1_and_dataReq(data_question_gametype1, dataReq, data_results)
        resultController.create(dataReq)
        return this.setData(data_question_gametype1[0]).setMessage('Success').responseSuccess(res)
      }
      if (dataReq.gametype_id == 2) {
        const data_question_gametype2 = await this.generate_question_gametype2([], dataReq)
        format_data_question_gametype2_and_dataReq(data_question_gametype2, dataReq, data_results)
        resultController.create(dataReq)
        return this.setData(data_question_gametype2[0]).setMessage('Success').responseSuccess(res)
      }
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
  async get_previous_question_point(dataReq) {
    try {
      let data_update
      if (dataReq.skip == 1 && dataReq.gametype_id != 1) {
        data_update = {
          answer: '',
          status: false,
          point: 0,
        }
      } else {
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
        data_update = {
          answer: dataReq.answer,
          status: status,
          point: point,
        }
      }

      delete dataReq.answer
      delete dataReq.skip

      const resultController = new ResultController(new ResultRepository(Result))
      resultController.update(data_update, { where: dataReq })

      return data_update.point
    } catch (error) {
      return this.setMessage('Error')
    }
  }

  // OKE
  @UseBefore(CandidateMiddleware)
  @Post('/answer')
  async question_answer(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const dataReq = req.body
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const data_candidate: any = jwt.verify(accessToken, process.env.JWT_SECRET)
      dataReq.candidate_id = data_candidate.id

      const resultController = new ResultController(new ResultRepository(Result))
      const data_result_question: any = await resultController.get_data_result_question(dataReq)
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
      } else {
        const data_result: any = await resultController.get_question_answer_null(dataReq)
        time_remaining =
          Number(data_result[0].Gametype.total_time) - time_used(data_result[0].createdAt)
      }
      const previous_question_point: any = await this.get_previous_question_point(dataReq)
      if (data_result_question.length >= Number(process.env.num_question) - 1) {
        return this.finish_game(dataReq)
      }
      const data_results: any = await resultController.get_list_question_id_and_total_point(dataReq)
      if (dataReq.gametype_id == 1) {
        const question_data: any = await this.generate_question_gametype1(
          data_result_question.length == 0
            ? 2
            : data_result_question[data_result_question.length - 1].Question.level + 2,
        )
        format_data_question_gametype1_and_dataReq(question_data, dataReq, data_results)
        question_data[0].previous_question_point = previous_question_point
        dataReq.question_id = question_data[0].id
        await resultController.create(dataReq)
        return this.setData(question_data[0]).setMessage('Success').responseSuccess(res)
      }
      if (dataReq.gametype_id == 2) {
        const question_data: any = await this.generate_question_gametype2(
          data_results.list_question_id,
          dataReq,
        )
        format_data_question_gametype2_and_dataReq(question_data, dataReq, data_results)
        question_data[0].time_remaining = time_remaining
        question_data[0].previous_question_point = previous_question_point
        dataReq.question_id = question_data[0].id
        await resultController.create(dataReq)
        question_data[0].time_remaining = time_remaining
        return this.setData(question_data[0]).setMessage('Success').responseSuccess(res)
      }
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
