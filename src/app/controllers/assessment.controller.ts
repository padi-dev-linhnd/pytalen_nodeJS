import { Get, Post, JsonController, Req, Res, UseBefore } from 'routing-controllers'
import { NextFunction } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import { HrMiddleware } from '@middlewares/check_Hr.middleware'
import jwt, { Secret, JwtPayload } from 'jsonwebtoken'
import Assessment from '@repositories/assessment.repository'

import nodemailer from 'nodemailer'

@JsonController('/assessment')
@Service()
export class AssessmentController extends BaseController {
  constructor(protected assessment: Assessment) {
    super()
  }

  @UseBefore(HrMiddleware)
  @Get('/list')
  async get_list_assessment(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const data = await this.assessment.get_list_assessment(accessToken)
      return this.setData(data).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  @UseBefore(HrMiddleware)
  @Post('/create')
  async create_ssessment(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const dataHr: any = jwt.verify(accessToken, process.env.JWT_SECRET)
      const dataReq: any = req.body
      dataReq.hr_id = dataHr.id
      const dataAssessment = await this.assessment.create_Assessment(dataReq)
      if (dataAssessment == null) {
        return this.setErrors(401, 'Assessment already exists', res)
      }
      return this.setData(dataAssessment).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
