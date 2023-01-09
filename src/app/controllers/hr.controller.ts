import { Get, JsonController, Req, Res, UseBefore, Post, Delete } from 'routing-controllers'
import { NextFunction } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import HrRepository from '@repositories/hr.repository'
import { AdminMiddleware } from '@middlewares/check_Admin.middleware'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const { Op } = require('sequelize')

import { format_data_hr, format_data_gametype } from '@service/hr.service'
import GametypeRepository from '@repositories/gametype.repository'
import Gametype from '@models/entities/gametype.entity'
import HrGametypeRepository from '@repositories/hr_gametype.repository'
import Hr_gametype from '@models/entities/hrgametype.entity'

@JsonController('/hr')
@Service()
export class HrController extends BaseController {
  constructor(protected hrRepository: HrRepository) {
    super()
  }

  @Post('/login')
  async Hr_login(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const dataReq = req.body
      const data_hr = await this.hrRepository.findByCondition({
        where: { email: dataReq.email },
        attributes: ['id', 'email', 'role', 'password'],
        raw: true,
      })
      if (data_hr == null || bcrypt.compareSync(dataReq.password, data_hr.password) == false) {
        return res.status(400).json({ status: 400, message: 'sai ten dang nhap hoac mat khau' })
      }
      return this.setData(jwt.sign(data_hr, process.env.JWT_SECRET))
        .setMessage('Success')
        .responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  @UseBefore(AdminMiddleware)
  @Get('/list')
  async getHr(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const all_data_hr = await this.hrRepository.getAllWhere({
        attributes: {
          exclude: ['password', 'token', 'createdAt', 'updatedAt'],
        },
      })

      return this.setData(all_data_hr).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  @UseBefore(AdminMiddleware)
  @Post('/create')
  async createHr(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const dataReq = req.body
      const data_hr = await this.hrRepository.findByCondition({ where: { email: dataReq.email } })
      if (data_hr) {
        return res.status(400).json({ status: 400, message: 'email da ton tai' })
      }

      const list_gametype = Array.from(new Set(dataReq.Game_type))
      const gametypeRepository = new GametypeRepository(Gametype)
      const data_gametype = await gametypeRepository.getAllWhere({
        where: {
          id: {
            [Op.or]: list_gametype,
          },
        },
      })
      if (data_gametype.length != list_gametype.length) {
        return res.status(400).json({ status: 400, message: 'list gametype khong hop le' })
      }

      const hr_data = format_data_hr(dataReq)
      const data = await this.hrRepository.create(hr_data)

      const hr_last_insert = await this.hrRepository.findByEmail(data.email)
      const data_gametype_format = format_data_gametype(list_gametype, hr_last_insert.id)

      const hrGametypeRepository = new HrGametypeRepository(Hr_gametype)
      hrGametypeRepository.bulkcreate(data_gametype_format)

      return this.setData(data).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  @UseBefore(AdminMiddleware)
  @Delete('/delete')
  async deleteHr(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const dataReq = req.body
      const data = await this.hrRepository.deleteById(dataReq.hr_id)
      return this.setData(data).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
