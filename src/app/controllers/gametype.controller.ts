import { Get, JsonController, Req, Res } from 'routing-controllers'
import { NextFunction } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import GametypeRepository from '@repositories/gametype.repository'
const { Op } = require('sequelize')

@JsonController('/gametype')
@Service()
export class GametypeController extends BaseController {
  constructor(protected gametypeRepository: GametypeRepository) {
    super()
  }

  @Get('/list')
  async getGametype(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const findAllGametypeData = await this.gametypeRepository.getAllWhere({
        where: {
          // id: {
          //   [Op.or]: [1, 3],
          // },
        },
        attributes: {
          exclude: ['id', 'password', 'createdAt', 'updatedAt'],
        },
        raw: true,
        nest: true,
      })
      return this.setData(findAllGametypeData).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
