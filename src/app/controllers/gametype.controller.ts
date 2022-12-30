import { Get, JsonController, Req, Res, UseBefore } from 'routing-controllers'
import { NextFunction } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import GametypeRepository from '@repositories/gametype.repository'
import { HrMiddleware } from '@middlewares/check_Hr.middleware'

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
}
