import { AdminMiddleware } from '@middlewares/check_Admin.middleware'
import { Get, Post, JsonController, Req, Res, UseBefore, Put, Delete } from 'routing-controllers'
import { NextFunction } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import { HrMiddleware } from '@middlewares/check_Hr.middleware'
import { CandidateMiddleware } from '@middlewares/check_Candidate.middleware'
import AssessmentRepository from '@repositories/assessment.repository'
import jwt from 'jsonwebtoken'

import { GametypeController } from './gametype.controller'
import GametypeRepository from '@repositories/gametype.repository'
import Gametype from '@models/entities/gametype.entity'

import { AssessmentGametypeController } from './assessment_gametype.controller'
import AssessmentGametypeRepository from '@repositories/assessment_gametype.repository'
import Assessment_gametype from '@models/entities/assessment_gametype.entity'

import Hr from '@models/entities/hr.entity'
import Candidate from '@models/entities/candidate.entity'
import { format_data_assessment_gametype } from '@service/assessment.service'

@JsonController('/assessment')
@Service()
export class AssessmentController extends BaseController {
  constructor(protected assessmentRepository: AssessmentRepository) {
    super()
  }

  // OKE
  @UseBefore(AdminMiddleware)
  @Get('/all')
  async getAll(@Req() req: any, @Res() res: any) {
    try {
      const data = await this.assessmentRepository.getAll()
      return this.setData(data).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
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

  // OKE
  @UseBefore(HrMiddleware)
  @Post('/create')
  async create_ssessment(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const data_hr: any = jwt.verify(accessToken, process.env.JWT_SECRET)
      const dataReq: any = req.body
      dataReq.hr_id = data_hr.id

      const list_gametype: any = Array.from(new Set(dataReq.Game_type))
      delete dataReq.Game_type

      const data_assessment = await this.assessmentRepository.findByCondition({
        where: {
          name: dataReq.name,
          hr_id: dataReq.hr_id,
        },
      })
      if (data_assessment != null) {
        return this.setErrors(400, 'ten Assessment da ton tai', res)
      }

      const gametypeController = new GametypeController(new GametypeRepository(Gametype))
      const gametype_data: any = await gametypeController.getAllDataByHr(list_gametype, dataReq)
      if (gametype_data.length != list_gametype.length) {
        return this.setErrors(400, 'Hr khong co quyen tao assessment voi nhung gametype nay', res)
      }

      await this.assessmentRepository.create(dataReq)
      const assessment_data: any = await this.assessmentRepository.findByCondition({
        where: dataReq,
      })

      format_data_assessment_gametype(list_gametype, assessment_data.id)
      const assessmentGametypeController = new AssessmentGametypeController(
        new AssessmentGametypeRepository(Assessment_gametype),
      )
      await assessmentGametypeController.bulkCreate(list_gametype)

      return this.setData(assessment_data).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
  @UseBefore(HrMiddleware)
  @Put('/locked')
  async locked_assessment(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const dataReq: any = req.body
      const data_update = await this.assessmentRepository.update(
        { locked: true },
        {
          where: {
            id: dataReq.assessment_id,
          },
        },
      )
      return this.setData(undefined).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
  @UseBefore(HrMiddleware)
  @Put('/unlocked')
  async unlocked_assessment(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const dataReq: any = req.body
      const data_update = await this.assessmentRepository.update(
        { locked: false },
        {
          where: {
            id: dataReq.assessment_id,
          },
        },
      )
      return this.setData(undefined).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
  async getAllWhere(dataReq: any) {
    try {
      const data = await this.assessmentRepository.getAllWhere(dataReq)
      return data
    } catch (error) {
      return this.setMessage('Error')
    }
  }

  // OKE
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

  // OKE
  @UseBefore(HrMiddleware)
  @Delete('/delete')
  async deleteHr(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const dataReq = req.body
      const data = await this.assessmentRepository.deleteById(dataReq.assessment_id)
      return this.setData(data).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
