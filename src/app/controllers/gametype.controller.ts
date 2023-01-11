import { AdminMiddleware } from '@middlewares/check_Admin.middleware'
import { Get, JsonController, Req, Res, UseBefore } from 'routing-controllers'
import { NextFunction } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import GametypeRepository from '@repositories/gametype.repository'
import { HrMiddleware } from '@middlewares/check_Hr.middleware'
import { CandidateMiddleware } from '@middlewares/check_Candidate.middleware'
import jwt from 'jsonwebtoken'
const { Op } = require('sequelize')
import Hr from '@models/entities/hr.entity'
import Assessment from '@models/entities/assessment.entity'

@JsonController('/gametype')
@Service()
export class GametypeController extends BaseController {
  constructor(protected gametypeRepository: GametypeRepository) {
    super()
  }

  // OKE
  @UseBefore(AdminMiddleware)
  @Get('/all')
  async getAll(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const data = await this.gametypeRepository.getAll()
      return this.setData(data).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
  async getAllData(list_gametype) {
    try {
      const data = await this.gametypeRepository.getAllWhere({
        where: {
          id: {
            [Op.or]: list_gametype,
          },
        },
      })
      return data
    } catch (error) {
      return this.setMessage('Error')
    }
  }

  // OKE
  @UseBefore(HrMiddleware)
  @Get('/list')
  async getGametype(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const data_hr: any = jwt.verify(accessToken, process.env.JWT_SECRET)

      const data_gametype = await this.gametypeRepository.getAllWhere({
        include: {
          model: Hr,
          where: {
            id: data_hr.id,
          },
          attributes: [],
        },
      })

      return this.setData(data_gametype).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
  async getAllDataByHr(list_gametype, dataReq) {
    try {
      const data = await this.gametypeRepository.getAllWhere({
        where: {
          id: {
            [Op.or]: list_gametype,
          },
        },
        include: {
          model: Hr,
          where: {
            id: dataReq.hr_id,
          },
        },
      })
      return data
    } catch (error) {
      return this.setMessage('Error')
    }
  }

  // OKE
  @UseBefore(CandidateMiddleware)
  @Get('/generate-list')
  async generate_gametype(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const data_candidate: any = jwt.verify(accessToken, process.env.JWT_SECRET)
      const assessment_id = req.query.assessment_id

      const data_gametype = await this.gametypeRepository.getAllWhere({
        include: {
          model: Assessment,
          where: {
            id: assessment_id,
          },
        },
        raw: true,
        nest: true,
      })

      data_gametype.map((item) => {
        delete item.Assessment
      })

      return this.setData(data_gametype).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
  async get_list_gametype_assessment(assessment_id) {
    try {
      const data = await this.gametypeRepository.getAllWhere({
        nest: true,
        raw: true,
        include: {
          model: Assessment,
          where: { id: assessment_id },
        },
      })
      data.map((item) => {
        delete item.Assessment
      })
      return data
    } catch (error) {
      return this.setMessage('Error')
    }
  }
}
