import { AdminMiddleware } from '@middlewares/check_Admin.middleware'
import { Get, Post, JsonController, Req, Res, UseBefore, Put, Delete } from 'routing-controllers'
import { NextFunction } from 'express'
import { BaseController } from './base.controller'
import { Service } from 'typedi'
import { HrMiddleware } from '@middlewares/check_Hr.middleware'
import { CandidateMiddleware } from '@middlewares/check_Candidate.middleware'
import AssessmentRepository from '@repositories/assessment.repository'
import jwt from 'jsonwebtoken'
import Sequelize from 'sequelize'
const { Op } = require('sequelize')

import { InviteController } from './invite.controller'
import InviteRepository from '@repositories/invite.repository'
import Invite from '@models/entities/invite.entity'

import { ResultController } from './result.controller'
import ResultRepository from '@repositories/result.ropository'
import Result from '@models/entities/result.entity'

import { GametypeController } from './gametype.controller'
import GametypeRepository from '@repositories/gametype.repository'
import Gametype from '@models/entities/gametype.entity'

import { AssessmentGametypeController } from './assessment_gametype.controller'
import AssessmentGametypeRepository from '@repositories/assessment_gametype.repository'
import Assessment_gametype from '@models/entities/assessment_gametype.entity'

import Hr from '@models/entities/hr.entity'
import Candidate from '@models/entities/candidate.entity'
import { format_data_assessment_gametype } from '@service/assessment.service'

@JsonController('/assessment')
@Service()
export class AssessmentController extends BaseController {
  constructor(protected assessmentRepository: AssessmentRepository) {
    super()
  }

  // OKE
  @UseBefore(AdminMiddleware)
  @Get('/all')
  async getAll(@Req() req: any, @Res() res: any) {
    try {
      const data = await this.assessmentRepository.getAll()
      return this.setData(data).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
  @UseBefore(HrMiddleware)
  @Get('/list')
  async get_list_assessment(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const data_hr: any = jwt.verify(accessToken, process.env.JWT_SECRET)

      const data_assessment = await this.assessmentRepository.getAllWhere({
        include: {
          model: Hr,
          where: {
            id: data_hr.id,
          },
          attributes: [],
        },
      })

      return this.setData(data_assessment).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
  @UseBefore(HrMiddleware)
  @Post('/create')
  async create_ssessment(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const data_hr: any = jwt.verify(accessToken, process.env.JWT_SECRET)
      const dataReq: any = req.body
      dataReq.hr_id = data_hr.id

      const list_gametype: any = Array.from(new Set(dataReq.Game_type))
      delete dataReq.Game_type

      const data_assessment = await this.assessmentRepository.findByCondition({
        where: {
          name: dataReq.name,
          hr_id: dataReq.hr_id,
        },
      })
      if (data_assessment != null) {
        return this.setErrors(400, 'ten Assessment da ton tai', res)
      }

      if (
        isNaN(Date.parse(dataReq.end_date)) != false ||
        isNaN(Date.parse(dataReq.start_date)) != false
      ) {
        return this.setErrors(400, 'not a valid date', res)
      }

      const gametypeController = new GametypeController(new GametypeRepository(Gametype))
      const gametype_data: any = await gametypeController.getAllDataByHr(list_gametype, dataReq)
      if (gametype_data.length != list_gametype.length) {
        return this.setErrors(400, 'Hr khong co quyen tao assessment voi nhung gametype nay', res)
      }

      await this.assessmentRepository.create(dataReq)
      const assessment_data: any = await this.assessmentRepository.findByCondition({
        where: dataReq,
      })

      format_data_assessment_gametype(list_gametype, assessment_data.id)
      const assessmentGametypeController = new AssessmentGametypeController(
        new AssessmentGametypeRepository(Assessment_gametype),
      )
      await assessmentGametypeController.bulkCreate(list_gametype)

      return this.setData(assessment_data).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
  @UseBefore(HrMiddleware)
  @Put('/locked')
  async locked_assessment(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const dataReq: any = req.body
      const data_update = await this.assessmentRepository.update(
        { locked: true },
        {
          where: {
            id: dataReq.assessment_id,
          },
        },
      )
      return this.setData(undefined).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
  @UseBefore(HrMiddleware)
  @Put('/unlocked')
  async unlocked_assessment(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const dataReq: any = req.body
      const data_update = await this.assessmentRepository.update(
        { locked: false },
        {
          where: {
            id: dataReq.assessment_id,
          },
        },
      )
      return this.setData(undefined).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
  async getAllWhere(dataReq: any) {
    try {
      const data = await this.assessmentRepository.getAllWhere(dataReq)
      return data
    } catch (error) {
      return this.setMessage('Error')
    }
  }

  // OKE
  @UseBefore(CandidateMiddleware)
  @Get('/list-by-candidate')
  async Candidate_get_assessment(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const data_andidate: any = jwt.verify(accessToken, process.env.JWT_SECRET)

      const data_assessment: any = await this.assessmentRepository.getAllWhere({
        include: [
          {
            model: Candidate,
            where: { id: data_andidate.id },
            attributes: [],
          },
        ],
        nest: true,
        raw: true,
      })
      data_assessment.map((item) => {
        delete item.Candidate
      })

      return this.setData(data_assessment).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
  @UseBefore(HrMiddleware)
  @Delete('/delete')
  async deleteHr(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const dataReq = req.body
      const data = await this.assessmentRepository.deleteById(dataReq.assessment_id)
      return this.setData(data).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
  @UseBefore(HrMiddleware)
  @Put('/edit')
  async edit_ssessment(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const data_hr: any = jwt.verify(accessToken, process.env.JWT_SECRET)
      const dataReq: any = req.body
      dataReq.hr_id = data_hr.id

      const data_assessment = await this.assessmentRepository.findByCondition({
        where: {
          name: dataReq.name,
          hr_id: dataReq.hr_id,
        },
      })
      if (data_assessment != null) {
        return this.setErrors(400, 'chon ten khac', res)
      }

      if (
        isNaN(Date.parse(dataReq.end_date)) != false ||
        isNaN(Date.parse(dataReq.start_date)) != false
      ) {
        return this.setErrors(400, 'not a valid date', res)
      }

      await this.assessmentRepository.update(dataReq, { where: { id: dataReq.assessment_id } })

      return this.setData(undefined).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
  @UseBefore(HrMiddleware)
  @Post('/copy')
  async copy_ssessment(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const dataReq = req.body
      const data_assessment = await this.assessmentRepository.findByCondition({
        where: { id: dataReq.assessment_id },
        raw: true,
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      })
      let i = -1
      let check = true
      while (check == true) {
        i++
        const data = await this.assessmentRepository.findByCondition({
          where: { name: data_assessment.name + ' ' + 'copy' + (i == 0 ? '' : i) },
        })
        if (data == null) {
          check = false
        }
      }

      const gametypeController = new GametypeController(new GametypeRepository(Gametype))
      const list_gametype_assessment: any = await gametypeController.get_list_gametype_assessment(
        data_assessment.id,
      )
      const list_gametype = []
      list_gametype_assessment.map((item) => {
        list_gametype.push(item.id)
      })

      delete data_assessment.id

      data_assessment.name = data_assessment.name + ' ' + 'copy' + (i == 0 ? '' : i)
      await this.assessmentRepository.create(data_assessment)
      const data_res = await this.assessmentRepository.findByCondition({
        where: { name: data_assessment.name },
      })

      format_data_assessment_gametype(list_gametype, data_res.id)
      const assessmentGametypeController = new AssessmentGametypeController(
        new AssessmentGametypeRepository(Assessment_gametype),
      )
      await assessmentGametypeController.bulkCreate(list_gametype)

      return this.setData(data_res).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
  @UseBefore(HrMiddleware)
  @Get('/detail')
  async detail(@Req() req: any, @Res() res: any, next: NextFunction) {
    try {
      const params = req.query
      if (!params.id) {
        return this.setErrors(400, 'khong xac dinh dc assessment nao', res)
      }

      const resultController = new ResultController(new ResultRepository(Result))
      const num_candidate_played = await resultController.get_num_candidate_played(params.id)

      const inviteController = new InviteController(new InviteRepository(Invite))
      const num_candidate_invited = await inviteController.get_num_candidate_invited(params.id)

      const gametypeController = new GametypeController(new GametypeRepository(Gametype))
      const list_gametype_assessment = await gametypeController.get_list_gametype_assessment(
        params.id,
      )

      const data_assessment: any = await this.assessmentRepository.findByCondition({
        where: {
          id: params.id,
        },
        raw: true,
      })

      data_assessment.list_gametype_assessment = list_gametype_assessment
      data_assessment.num_candidate_invited = num_candidate_invited
      data_assessment.num_candidate_played = num_candidate_played

      return this.setData(data_assessment).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }

  // OKE
  @UseBefore(HrMiddleware)
  @Get('/all_result')
  async getAll_result_byHr(@Req() req: any, @Res() res: any) {
    try {
      const accessToken = req.headers.authorization.split('Bearer ')[1].trim()
      const data_hr: any = jwt.verify(accessToken, process.env.JWT_SECRET)

      const params = req.query
      const list_id = []
      if (params.assessment_id) {
        list_id.push(params.assessment_id)
      }

      const data_assessment = await this.assessmentRepository.getAllWhere({
        where: {
          id: { [Op.or]: list_id },
        },

        attributes: [[Sequelize.col('assessment_id'), 'assessment_id']],
        group: ['candidate_id', 'gametype_id', 'assessment_id'],
        order: [['id', 'ASC']],
        include: [
          {
            model: Hr,
            where: {
              id: data_hr.id,
            },
            attributes: [],
          },
          {
            model: Result,
            as: 'Result',
            attributes: [
              'candidate_id',
              'gametype_id',
              [Sequelize.fn('sum', Sequelize.col('point')), 'total_point'],
            ],
            where: {
              assessment_id: { [Op.ne]: null },
            },
          },
        ],
      })
      return this.setData(data_assessment).setMessage('Success').responseSuccess(res)
    } catch (error) {
      return this.setMessage('Error').responseErrors(res)
    }
  }
}
