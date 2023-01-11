import { Get, Post, JsonController, Req, Res, UseBefore } from 'routing-controllers'
import { NextFunction } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import CandidateRepository from '@repositories/candidate.repository'
import { HrMiddleware } from '@middlewares/check_Hr.middleware'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { ValidateEmail } from '@service/base.services'
import { Invite_candidate, format_data_invite } from '@service/candidate.service'
import { CandidateMiddleware } from '@middlewares/check_Candidate.middleware'
import { AdminMiddleware } from '@middlewares/check_Admin.middleware'
import Hr from '@models/entities/hr.entity'
import Sequelize from 'sequelize'
import Result from '@models/entities/result.entity'
const { Op } = require('sequelize')

import { QuestionController } from './question.controller'
import QuestionRepository from '@repositories/question.repository'
import Question from '@models/entities/question.entity'

import { AssessmentController } from './assessment.controller'
import AssessmentRepository from '@repositories/assessment.repository'
import Assessment from '@models/entities/assessment.entity'

import { InviteController } from './invite.controller'
import InviteRepository from '@repositories/invite.repository'
import Invite from '@models/entities/invite.entity'

@JsonController('/candidate')
@Service()
export class CandidateController extends BaseController {
  constructor(protected candidateRepository: CandidateRepository) {
    super()
  }

  // OKE
  @UseBefore(HrMiddleware)
  @Post('/invite')
  async invite_cadidate(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const hr_data: any = jwt.verify(accessToken, process.env.JWT_SECRET)
      const dataReq: any = req.body
      dataReq.hr_id = hr_data.id
      const list_email = dataReq.list_email
      delete dataReq.list_email

      const assessmentController = new AssessmentController(new AssessmentRepository(Assessment))
      const data_assessment: any = await assessmentController.getAllWhere({
        where: { id: dataReq.assessment_id },
        raw: true,
      })
      if (data_assessment[0].locked == true) {
        return this.setErrors(400, 'assessment nay da dong', res)
      }

      list_email.forEach(async (item) => {
        const data_candidate = await this.candidateRepository.findByCondition({
          where: { email: item },
          raw: true,
          nest: true,
        })

        const inviteController = new InviteController(new InviteRepository(Invite))
        if (data_candidate != null) {
          const candidate_token = data_candidate.token
          Invite_candidate(item, candidate_token)
          const data_invite = await inviteController.findByCondition({
            where: {
              candidate_id: data_candidate.id,
              hr_id: dataReq.hr_id,
              assessment_id: dataReq.assessment_id,
            },
          })
          if (data_invite == null) {
            await inviteController.create(format_data_invite(dataReq, data_candidate.id))
          }
        } else {
          const token = crypto.randomBytes(5).toString('hex')
          Invite_candidate(item, token)
          await this.candidateRepository.create({ email: item, token: token })
          const candidate_data = await this.candidateRepository.findByCondition({
            where: { email: item, token: token },
          })
          await inviteController.create(format_data_invite(dataReq, candidate_data.id))
        }
      })
      return this.setData(list_email).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
  @Get('/login')
  async Candidate_start(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      return res.send('NHẬP EMAIL Ở ĐÂY ĐỂ ĐĂNG NHẬP')
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
  @Post('/login')
  async Candidate_login(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const token_params = req.query.token
      const dataReq = req.body
      dataReq.token = token_params
      if (ValidateEmail([dataReq.email]) == false) {
        return this.setErrors(400, 'email not valid', res)
      }

      const data_candidate: any = await this.candidateRepository.findByCondition({
        where: dataReq,
        raw: true,
      })
      if (data_candidate == null) {
        return this.setErrors(400, 'dang nhap that bai', res)
      }
      data_candidate.login = true
      const token = jwt.sign(data_candidate, process.env.JWT_SECRET)

      return this.setData(token).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
  @UseBefore(CandidateMiddleware)
  @Post('/finish_game')
  async game_finish(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const dataReq = req.body
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const data_candidate: any = jwt.verify(accessToken, process.env.JWT_SECRET)
      dataReq.candidate_id = data_candidate.id

      const questionController = new QuestionController(new QuestionRepository(Question))

      const finish_game = await questionController.finish_game(dataReq)

      return this.setData(finish_game).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
  @UseBefore(AdminMiddleware)
  @Get('/all')
  async getAll(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const data = await this.candidateRepository.getAllWhere({
        attributes: {
          exclude: ['token'],
        },
      })
      return this.setData(data).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
  @UseBefore(HrMiddleware)
  @Get('/list')
  async getList(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const data_hr: any = jwt.verify(accessToken, process.env.JWT_SECRET)

      const data = await this.candidateRepository.getAllWhere({
        attributes: {
          exclude: ['token'],
        },
        include: {
          model: Hr,
          where: {
            id: data_hr.id,
          },
          attributes: [],
        },
      })

      return this.setData(data).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
  @UseBefore(AdminMiddleware)
  @Get('/all_result')
  async getAll_Result(@Req() req: any, @Res() res: any) {
    try {
      const params = req.query
      const list_id = []
      if (params.id) {
        list_id.push(params.id)
      }
      const data = await this.candidateRepository.getAllWhere({
        where: {
          id: { [Op.or]: list_id },
        },
        attributes: [[Sequelize.col('candidate_id'), 'candidate_id']],
        include: {
          model: Result,
          as: 'Result',
          attributes: [
            'assessment_id',
            'gametype_id',
            [Sequelize.fn('sum', Sequelize.col('point')), 'total_point'],
          ],
          where: {
            candidate_id: { [Op.ne]: null },
          },
        },
        group: ['candidate_id', 'gametype_id', 'assessment_id'],
        order: [['id', 'ASC']],
      })
      return this.setData(data).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
