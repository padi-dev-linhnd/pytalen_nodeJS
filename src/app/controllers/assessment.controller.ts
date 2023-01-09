const { Op } = require('sequelize')
import { AdminMiddleware } from '@middlewares/check_Admin.middleware'
import { Get, Post, JsonController, Req, Res, UseBefore } from 'routing-controllers'
import { NextFunction } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import { HrMiddleware } from '@middlewares/check_Hr.middleware'
import { CandidateMiddleware } from '@middlewares/check_Candidate.middleware'
import AssessmentRepository from '@repositories/assessment.repository'
import jwt from 'jsonwebtoken'

import Hr from '@models/entities/hr.entity'
import Candidate from '@models/entities/candidate.entity'
import { format_data_assessment_gametype } from '@service/assessment.service'
import GametypeRepository from '@repositories/gametype.repository'
import Gametype from '@models/entities/gametype.entity'
import AssessmentGametypeRepository from '@repositories/assessment_gametype.repository'
import Assessment_gametype from '@models/entities/assessment_gametype.entity'

@JsonController('/assessment')
@Service()
export class AssessmentController extends BaseController {
  constructor(protected assessmentRepository: AssessmentRepository) {
    super()
  }

  @UseBefore(AdminMiddleware)
  @Get('/all')
  async getAll(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const data = await this.assessmentRepository.getAllWhere({
        attributes: ['id', 'name', 'position', 'start_date', 'end_date'],
      })

      return this.setData(data).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  @UseBefore(HrMiddleware)
  @Get('/list')
  async get_list_assessment(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const data_hr: any = jwt.verify(accessToken, process.env.JWT_SECRET)

      const data_assessment = await this.assessmentRepository.getAllWhere({
        include: {
          model: Hr,
          where: {
            id: data_hr.id,
          },
          attributes: [],
        },
      })

      return this.setData(data_assessment).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  @UseBefore(HrMiddleware)
  @Post('/create')
  async create_ssessment(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const data_hr: any = jwt.verify(accessToken, process.env.JWT_SECRET)
      const dataReq: any = req.body
      dataReq.hr_id = data_hr.id

      const list_data_gametype: any = Array.from(new Set(dataReq.Game_type))
      delete dataReq.Game_type

      const data_assessment = await this.assessmentRepository.findByCondition({
        where: {
          name: dataReq.name,
          hr_id: dataReq.hr_id,
        },
      })
      if (data_assessment != null) {
        return res.status(400).json({ status: 400, message: 'ten Assessment da ton tai' })
      }

      const gametypeRepository = new GametypeRepository(Gametype)
      const gametype_data = await gametypeRepository.getAllWhere({
        where: {
          id: {
            [Op.or]: list_data_gametype,
          },
        },
        include: {
          model: Hr,
          where: {
            id: dataReq.hr_id,
          },
        },
      })
      if (gametype_data.length != list_data_gametype.length) {
        return res
          .status(400)
          .json({ status: 400, message: 'Hr khong co quyen tao assessment voi nhung gametype nay' })
      }

      this.assessmentRepository.create(dataReq)
      const assessment_data: any = await this.assessmentRepository.findByCondition({
        where: dataReq,
      })

      format_data_assessment_gametype(list_data_gametype, assessment_data.id)
      const assessmentGametypeRepository = new AssessmentGametypeRepository(Assessment_gametype)
      assessmentGametypeRepository.bulkcreate(list_data_gametype)

      return this.setData(dataReq).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  @UseBefore(CandidateMiddleware)
  @Get('/list-by-candidate')
  async Candidate_get_assessment(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const data_andidate: any = jwt.verify(accessToken, process.env.JWT_SECRET)

      const data_assessment: any = await this.assessmentRepository.getAllWhere({
        include: [
          {
            model: Candidate,
            where: { id: data_andidate.id },
            attributes: [],
          },
        ],
        nest: true,
        raw: true,
      })
      data_assessment.map((item) => {
        delete item.Candidate
      })

      return this.setData(data_assessment).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
