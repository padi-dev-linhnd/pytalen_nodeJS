import { Req, Res } from 'routing-controllers'
import { NextFunction } from 'express'
import { ExpressMiddlewareInterface } from 'routing-controllers'
import { Service } from 'typedi'
import { HttpException } from '@exceptions/http.exception'
import jwt from 'jsonwebtoken'
import { ValidateEmail } from '@service/base.services'

import HrRepository from '@repositories/hr.repository'
import Hr from '@models/entities/hr.entity'
import Assessment from '@models/entities/assessment.entity'

@Service()
export class HrMiddleware implements ExpressMiddlewareInterface {
  // interface implementation is optional
  async use(@Req() req: any, @Res() res: any, next: NextFunction): Promise<any> {
    const bearer = req.headers.authorization
    if (!bearer || !bearer.startsWith('Bearer ')) {
      return next(new HttpException(401, 'Unauthorised'))
    }
    const accessToken = bearer.split('Bearer ')[1].trim()
    try {
      const dataHr: any = jwt.verify(accessToken, process.env.JWT_SECRET)
      const dataReq = req.body
      dataReq.hr_id = dataHr.id
      if (req.query.assessment_id) {
        dataReq.assessment_id = req.query.assessment_id
      }

      if (dataHr.role == 'admin') {
        return next(new HttpException(401, 'Ban la admin'))
      }
      if (dataHr.role != 'hr') {
        return next(new HttpException(401, 'Ban khong phai Hr'))
      }
      if (dataReq.email) {
        const data = ValidateEmail([dataReq.email])
        if (data == false) {
          return next(new HttpException(400, 'email khong hop le'))
        }
      }
      if (dataReq.list_email) {
        const data = ValidateEmail(dataReq.list_email)
        if (data == false) {
          return next(new HttpException(400, 'email khong hop le'))
        }
      }
      if (dataReq.assessment_id && dataReq.hr_id) {
        const hrRepository = new HrRepository(Hr)
        const data_hr = await hrRepository.findByCondition({
          where: { id: dataReq.hr_id },
          include: {
            model: Assessment,
            where: { id: dataReq.assessment_id },
          },
        })
        if (data_hr == null) {
          return next(new HttpException(400, 'Ban khong so huu Assessment nay'))
        }
      }
      return next()
    } catch (error) {
      return next(new HttpException(401, 'Unauthorised'))
    }
  }
}
