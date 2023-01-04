import { Get, Post, JsonController, Req, Res, UseBefore } from 'routing-controllers'
import { NextFunction } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import QuestionRepository from '@repositories/question.repository'

@JsonController('/question')
@Service()
export class QuestionController extends BaseController {
  constructor(protected questionRepository: QuestionRepository) {
    super()
  }

  @Post('/generate')
  async generate_question(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const dataReq = req.body
      const data_question = await this.questionRepository.generate_question(dataReq, accessToken)
      if (typeof data_question == 'string') {
        return this.setErrors(400, data_question, res)
      }
      return this.setData(data_question).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  @Post('/answer')
  async question_answer(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      return this.setData(undefined).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
