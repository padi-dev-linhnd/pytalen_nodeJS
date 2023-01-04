import { Get, Post, JsonController, Req, Res, UseBefore } from 'routing-controllers'
import { NextFunction } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import CandidateRepository from '@repositories/candidate.repository'
import { format_candidate } from '@service/all_service.service'

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
      const data_candidate = await format_candidate(dataReq, token_params)
      return this.setData(data_candidate).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
