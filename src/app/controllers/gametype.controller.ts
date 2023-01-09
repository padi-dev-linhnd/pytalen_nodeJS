import { AdminMiddleware } from '@middlewares/check_Admin.middleware'
import { Get, JsonController, Req, Res, UseBefore } from 'routing-controllers'
import { NextFunction } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import GametypeRepository from '@repositories/gametype.repository'
import { HrMiddleware } from '@middlewares/check_Hr.middleware'
import { CandidateMiddleware } from '@middlewares/check_Candidate.middleware'
import jwt from 'jsonwebtoken'

import Hr from '@models/entities/hr.entity'
import InviteRepository from '@repositories/invite.repository'
import Invite from '@models/entities/invite.entity'
import Assessment from '@models/entities/assessment.entity'

@JsonController('/gametype')
@Service()
export class GametypeController extends BaseController {
  constructor(protected gametypeRepository: GametypeRepository) {
    super()
  }

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

  @UseBefore(AdminMiddleware)
  @Get('/all')
  async getAll(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const data = await this.gametypeRepository.getAllWhere({
        attributes: ['name', 'total_time', 'time_question', 'total_question'],
      })
      return this.setData(data).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  @UseBefore(CandidateMiddleware)
  @Get('/generate-list')
  async generate_gametype(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const data_candidate: any = jwt.verify(accessToken, process.env.JWT_SECRET)
      const assessment_id = req.query.assessment_id

      const inviteRepository = new InviteRepository(Invite)
      const data_invite = await inviteRepository.findByCondition({
        where: {
          candidate_id: data_candidate.id,
          assessment_id: assessment_id,
        },
      })
      if (data_invite == null) {
        return res
          .status(400)
          .json({ status: 400, message: 'ban khong co quyen vao Assessment nay' })
      }

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
}
