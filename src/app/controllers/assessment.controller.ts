import { AdminMiddleware } from '@middlewares/check_Admin.middleware'
import { Get, Post, JsonController, Req, Res, UseBefore } from 'routing-controllers'
import { NextFunction } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import { HrMiddleware } from '@middlewares/check_Hr.middleware'
import { CandidateMiddleware } from '@middlewares/check_Candidate.middleware'
import Assessment from '@repositories/assessment.repository'

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

  @UseBefore(AdminMiddleware)
  @Get('/all')
  async getAll(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const data = await this.assessment.getAllWhere({
        attributes: ['id', 'name', 'position', 'start_date', 'end_date'],
      })
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
      const dataReq: any = req.body
      const dataAssessment = await this.assessment.create_Assessment(dataReq, accessToken)

      if (typeof dataAssessment == 'string') {
        return this.setErrors(400, dataAssessment, res)
      }
      return this.setData(dataAssessment).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  @UseBefore(CandidateMiddleware)
  @Get('/list-by-candidate')
  async Candidate_start_game(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const dataAssessment = await this.assessment.getAssessmentCandidate(accessToken)
      return this.setData(dataAssessment).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
