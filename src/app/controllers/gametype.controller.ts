import { AdminMiddleware } from '@middlewares/check_Admin.middleware'
import { Get, JsonController, Req, Res, UseBefore } from 'routing-controllers'
import { NextFunction } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import GametypeRepository from '@repositories/gametype.repository'
import { HrMiddleware } from '@middlewares/check_Hr.middleware'
import { CandidateMiddleware } from '@middlewares/check_Candidate.middleware'

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
      const data = await this.gametypeRepository.getGametype(accessToken)
      return this.setData(data).setMessage('Success').responseSuccess(res)
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
      const params = req.query
      const data_gametype = await this.gametypeRepository.generate_gametype(params, accessToken)
      if (typeof data_gametype == 'string') {
        return this.setErrors(400, data_gametype, res)
      }
      return this.setData(data_gametype).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
