import { Get, Post, JsonController, Req, Res, UseBefore } from 'routing-controllers'
import { NextFunction } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import CandidateRepository from '@repositories/candidate.repository'
import { HrMiddleware } from '@middlewares/check_Hr.middleware'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

import { Invite_candidate, format_data_invite } from '@service/candidate.service'
import HrRepository from '@repositories/hr.repository'
import Hr from '@models/entities/hr.entity'
import Assessment from '@models/entities/assessment.entity'
import InviteRepository from '@repositories/invite.repository'
import Invite from '@models/entities/invite.entity'

@JsonController('/candidate')
@Service()
export class CandidateController extends BaseController {
  constructor(protected candidateRepository: CandidateRepository) {
    super()
  }

  @Get('/')
  async Candidate_start(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      return res.send('NHẬP EMAIL Ở ĐÂY ĐỂ ĐĂNG NHẬP')
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  @Post('/login')
  async Candidate_login(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const token_params = req.query.token
      const dataReq = req.body
      dataReq.token = token_params

      const data_candidate: any = await this.candidateRepository.findByCondition({
        where: dataReq,
        raw: true,
      })
      if (data_candidate == null) {
        return res.status(400).json({ status: 400, message: 'dang nhap that bai' })
      }
      data_candidate.login = true
      const token = jwt.sign(data_candidate, process.env.JWT_SECRET)

      return this.setData(token).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

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

      const hrRepository = new HrRepository(Hr)
      const data_hr = await hrRepository.findByCondition({
        where: { id: dataReq.hr_id },
        include: {
          model: Assessment,
          where: { id: dataReq.assessment_id },
        },
      })
      if (data_hr == null) {
        return res.status(400).json({ status: 400, message: 'Ban khong so huu Assessment nay' })
      }

      list_email.forEach(async (item) => {
        const data_candidate = await this.candidateRepository.findByCondition({
          where: { email: item },
          raw: true,
          nest: true,
        })
        const inviteRepository = new InviteRepository(Invite)
        if (data_candidate != null) {
          const candidate_token = data_candidate.token
          Invite_candidate(item, candidate_token)
          const data_invite = await inviteRepository.findByCondition({
            where: {
              candidate_id: data_candidate.id,
              hr_id: dataReq.hr_id,
              assessment_id: dataReq.assessment_id,
            },
          })
          if (data_invite == null) {
            await inviteRepository.create(format_data_invite(dataReq, data_candidate.id))
          }
        } else {
          const token = crypto.randomBytes(5).toString('hex')
          Invite_candidate(item, token)
          await this.candidateRepository.create({ email: item, token: token })
          const candidate_data = await this.candidateRepository.findByCondition({
            where: { email: item, token: token },
          })
          await inviteRepository.create(format_data_invite(dataReq, candidate_data.id))
        }
      })

      return this.setData(list_email).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
