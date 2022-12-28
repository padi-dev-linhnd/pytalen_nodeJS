import { Get, JsonController, Req, Res, UseBefore } from 'routing-controllers'
import { NextFunction } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import GametypeRepository from '@repositories/gametype.repository'
import { AdminMiddleware } from '@middlewares/check_Admin.middleware'
import { HrMiddleware } from '@middlewares/check_Hr.middleware'

const { Op } = require('sequelize')
import Gametype from '@models/entities/gametype.entity'
import Question from '@models/entities/question.entity'
import Answer from '@models/entities/answer.entity'

@JsonController('/gametype')
@Service()
export class GametypeController extends BaseController {
  constructor(protected gametypeRepository: GametypeRepository) {
    super()
  }

  @UseBefore(AdminMiddleware)
  @Get('/admin/list')
  async getGametypeByAdmin(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const findAllGametypeData = await this.gametypeRepository.getAllWhere({
        // where: {
        // id: {
        //   [Op.or]: [1, 3],
        // },
        // },
        attributes: {
          exclude: ['id', 'password', 'createdAt', 'updatedAt'],
        },
        raw: true,
        nest: true,
      })
      // const test = await Gametype.findAll({
      //   include: {
      //     model: Question,
      //     // as: 'Question',
      //     include: [Answer],
      //     where: {},
      //     attributes: {
      //       exclude: ['id', 'password', 'createdAt', 'updatedAt'],
      //     },
      //   },
      // })
      return this.setData(findAllGametypeData).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  @UseBefore(HrMiddleware)
  @Get('/hr/list')
  async getGametypeByHr(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const data = await this.gametypeRepository.getGametypeByHr(accessToken)
      return this.setData(data).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
