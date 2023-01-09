import { Req, Res } from 'routing-controllers'
import { NextFunction } from 'express'
import { ExpressMiddlewareInterface } from 'routing-controllers'
import { Service } from 'typedi'
import { HttpException } from '@exceptions/http.exception'
import jwt from 'jsonwebtoken'
import { ValidateEmail } from '@service/base.services'

import AssessmentGametypeRepository from '@repositories/assessment_gametype.repository'
import Assessment_gametype from '@models/entities/assessment_gametype.entity'

import QuestionRepository from '@repositories/question.repository'
import Question from '@models/entities/question.entity'

import InviteRepository from '@repositories/invite.repository'
import Invite from '@models/entities/invite.entity'

import ResultRepository from '@repositories/result.ropository'
import Result from '@models/entities/result.entity'

import AssessmentRepository from '@repositories/assessment.repository'
import Assessment from '@models/entities/assessment.entity'

@Service()
export class CandidateMiddleware implements ExpressMiddlewareInterface {
  // interface implementation is optional
  async use(@Req() req: any, @Res() res: any, next: NextFunction): Promise<any> {
    const bearer = req.headers.authorization
    if (!bearer || !bearer.startsWith('Bearer ')) {
      return next(new HttpException(401, 'Unauthorised'))
    }
    const accessToken = bearer.split('Bearer ')[1].trim()
    try {
      const dataCandidate: any = jwt.verify(accessToken, process.env.JWT_SECRET)
      const dataReq = req.body
      dataReq.candidate_id = dataCandidate.id
      if (req.query.assessment_id) {
        dataReq.assessment_id = req.query.assessment_id
      }

      if (dataCandidate.role == 'admin') {
        return next(new HttpException(401, 'Ban la admin'))
      }
      if (dataCandidate.role == 'hr') {
        return next(new HttpException(401, 'Ban la hr'))
      }
      if (dataCandidate.login != true) {
        return next(new HttpException(401, 'Not Candidate'))
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

      if ((dataReq.candidate_id, dataReq.assessment_id)) {
        const inviteRepository = new InviteRepository(Invite)
        const data = await inviteRepository.findByCondition({
          where: {
            candidate_id: dataReq.candidate_id,
            assessment_id: dataReq.assessment_id,
          },
        })
        if (data == null)
          return next(new HttpException(400, 'Candidate khong dc moi vao Assessment nay'))
      }

      if (dataReq.gametype_id && dataReq.assessment_id) {
        const assessmentGametypeRepository = new AssessmentGametypeRepository(Assessment_gametype)
        const data = await assessmentGametypeRepository.findByCondition({
          where: {
            gametype_id: dataReq.gametype_id,
            assessment_id: dataReq.assessment_id,
          },
        })
        if (data == null) return next(new HttpException(400, 'Assessment khong co gametype nay'))
      }

      if (dataReq.gametype_id && dataReq.question_id) {
        const questionRepository = new QuestionRepository(Question)
        const data = await questionRepository.findByCondition({
          where: {
            id: dataReq.question_id,
            gametype_id: dataReq.gametype_id,
          },
        })
        if (data == null) return next(new HttpException(400, 'loi question_id hoac gametype_id'))
      }

      if (
        dataReq.question_id &&
        dataReq.gametype_id &&
        dataReq.candidate_id &&
        dataReq.assessment_id
      ) {
        const resultRepository = new ResultRepository(Result)
        const data = await resultRepository.findByCondition({
          where: {
            question_id: dataReq.question_id,
            gametype_id: dataReq.gametype_id,
            candidate_id: dataReq.candidate_id,
            assessment_id: dataReq.assessment_id,
            answer: null,
          },
        })
        if (data == null)
          return next(new HttpException(400, 'da hoan thanh hoac k co quyen tra loi cau hoi nay'))
      }

      if (dataReq.assessment_id) {
        const assessmentRepository = new AssessmentRepository(Assessment)
        const data_assessment = await assessmentRepository.findByCondition({
          where: { id: dataReq.assessment_id },
          raw: true,
        })
        if (data_assessment.locked == true) {
          return next(new HttpException(400, 'assessment nay da dong'))
        }
        if (new Date(data_assessment.start_date) > new Date()) {
          return next(new HttpException(400, 'assessment chua bat dau'))
        }
        if (new Date() > new Date(data_assessment.end_date)) {
          return next(new HttpException(400, 'assessment da ket thuc'))
        }
      }

      return next()
    } catch (error) {
      return next(new HttpException(401, 'Unauthorised'))
    }
  }
}
