import bcrypt from 'bcrypt'
const { Op } = require('sequelize')
import jwt, { Secret, JwtPayload } from 'jsonwebtoken'
import Admin from '@models/entities/admin.entity'
import Hr from '@models/entities/hr.entity'
import Gametype from '@models/entities/gametype.entity'
import Hrgametype from '@models/entities/hrgametype.entity'
import Assessment from '@models/entities/assessment.entity'
import Result from '@models/entities/result.entity'
import Question from '@models/entities/question.entity'
import Answer from '@models/entities/answer.entity'
import Candidate from '@models/entities/candidate.entity'
import Invite from '@models/entities/invite.entity'
import Assessment_gametype from '@models/entities/assessment_gametype.entity'
import nodemailer from 'nodemailer'

// password
export function hash_password(password: string) {
  return bcrypt.hashSync(password, 10)
}

export function verify_password(password_Req: string, password_DB: string) {
  return bcrypt.compareSync(password_Req, password_DB)
}

// jwt
export function format_jwt(dataDB: any) {
  dataDB.token = jwt.sign(dataDB, process.env.JWT_SECRET)
  delete dataDB.role, delete dataDB.password
  return dataDB
}

// create HR
export async function check_email(email: string) {
  const dataHr = await Hr.findOne({ where: { email: email } })
  if (dataHr) {
    return true
  }
  return false
}

export function format_hr(dataReq: any) {
  const data_hr = dataReq
  delete data_hr.Game_type
  data_hr.password = hash_password(data_hr.password)
  return data_hr
}

export function format_gametype(data_gametype: any, hr_id: any) {
  data_gametype.map((item, index) => {
    data_gametype[index] = {
      gametype_id: item,
      hr_id: hr_id,
    }
  })
  return data_gametype
}

export async function check_gametype(data_gametype: any) {
  const check = Array.from(new Set(data_gametype))
  const dataGametype = await Gametype.findAll({
    where: {
      id: {
        [Op.or]: check,
      },
    },
  })
  if (dataGametype.length == check.length) return true
  return false
}

//  create_Assessment
export async function check_assessment(dataReq: any) {
  const dataAssessment: any = await Assessment.findOne({
    where: {
      name: dataReq.name,
      hr_id: dataReq.hr_id,
    },
  })
  if (dataAssessment != null) return 'Assessment da ton tai'
  return false
}

export async function check_gametype_assessment(dataGametype: any, dataReq: any) {
  const check = Array.from(new Set(dataGametype))
  const datagametype: any = await Gametype.findAll({
    where: {
      id: {
        [Op.or]: check,
      },
    },
    raw: true,
    nest: true,
    include: {
      model: Hr,
      where: {
        id: dataReq.hr_id,
      },
    },
  })
  if (datagametype.length != check.length) {
    return 'Hr khong co quyen tao assessment voi nhung gametype nay'
  }
}

export function format_datagametype(dataGametype: any, assessment_id: any) {
  dataGametype.map((item, index) => {
    dataGametype[index] = {
      assessment_id: assessment_id,
      gametype_id: item,
    }
  })
  return dataGametype
}

export function format_dataReq_hr(dataReq: any, accessToken: any) {
  const dataHr: any = jwt.verify(accessToken, process.env.JWT_SECRET)
  if (dataHr.role == 'admin') return 'ban la Admin'
  dataReq.hr_id = dataHr.id
  return dataReq
}

// invite_cadidate

export async function check_hr_asessment(dataReq: any) {
  const dataHr = await Hr.findAll({
    where: { id: dataReq.hr_id },
    include: {
      model: Assessment,
      where: { id: dataReq.assessment_id },
    },
  })
  if (dataHr.length == 0) return 'Hr khong so huu Assessment nay'
}

export async function check_candidate(email: any): Promise<number> {
  const dataCandidate: any = await Candidate.findOne({
    where: { email: email },
    raw: true,
    nest: true,
  })
  if (dataCandidate) return dataCandidate.id
  return -1
}

export async function check_candidate_invite(dataReq: any, id_candidate: any) {
  const invite_data = await Invite.findOne({
    where: {
      candidate_id: id_candidate,
      hr_id: dataReq.hr_id,
      assessment_id: dataReq.assessment_id,
    },
  })
  if (invite_data) return true
  return false
}

export function format_invite(dataReq: any, id_candidate: any) {
  return {
    candidate_id: id_candidate,
    hr_id: dataReq.hr_id,
    assessment_id: dataReq.assessment_id,
  }
}

export function Invite_candidate(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'linhtru2001@gmail.com',
      pass: 'lnmubgvtwcbnaykm',
    },
  })
  var mainOptions = {
    from: 'Nguyen Danh Linh',
    to: email,
    subject: 'invitation to take the test',
    text: `http://localhost:3000/api/v1/candidate?token=${token}`,
  }
  transporter.sendMail(mainOptions)
  return
}

//  candidate login
export async function format_candidate(dataReq: any, token_params: any) {
  dataReq.token = token_params
  const dataCandidate: any = await Candidate.findOne({
    where: dataReq,
    raw: true,
    attributes: ['id', 'email'],
  })
  dataCandidate.login = true
  const token = jwt.sign(dataCandidate, process.env.JWT_SECRET)
  dataCandidate.token = token
  delete dataCandidate.login
  return dataCandidate
}

//  list gametype in assessment

export async function check_assessment_candidate(assessment_id: any, candidate_id: any) {
  const data_invite = await Invite.findOne({
    where: {
      candidate_id: candidate_id,
      assessment_id: assessment_id,
    },
  })
  if (data_invite) return true
  return false
}

// generate question
export function format_dataReq_candidate(dataReq: any, accessToken: any) {
  const dataHr: any = jwt.verify(accessToken, process.env.JWT_SECRET)
  dataReq.candidate_id = dataHr.id
  return dataReq
}

export async function check_assessment_gametype(gametype_id: any, assessment_id: any) {
  const data_invite = await Assessment_gametype.findOne({
    where: {
      gametype_id: gametype_id,
      assessment_id: assessment_id,
    },
  })
  if (data_invite) return true
  return false
}

export async function check_result(dataReq) {
  const data_invite = await Result.findOne({
    where: {
      gametype_id: dataReq.gametype_id,
      candidate_id: dataReq.candidate_id,
      assessment_id: dataReq.assessment_id,
      answer: null,
    },
    raw: true,
  })
  if (data_invite) return data_invite.question_id
  return -1
}

export async function check_result_full(dataReq) {
  const data_invite = await Result.findAll({
    where: {
      gametype_id: dataReq.gametype_id,
      candidate_id: dataReq.candidate_id,
      assessment_id: dataReq.assessment_id,
      answer: {
        [Op.ne]: null,
      },
    },
  })
  if (data_invite.length == 10) return 'ban da hoan thanh gametype nay'
}

export async function format_question(data_question: any) {
  if (data_question.gametype_id == 1) {
    data_question.time_question = data_question.level * 3
    return data_question
  }
  const data_answer: any = await Answer.findAll({
    where: {},
    include: {
      model: Question,
      where: {
        id: data_question.id,
      },
      attributes: [],
    },
    raw: true,
    nest: true,
    attributes: ['id', 'answer'],
  })
  delete data_question.level
  const time_question = (await Gametype.findOne({ where: { id: data_question.gametype_id } }))
    .time_question
  data_question.time_question = time_question
  data_question.Answer = data_answer

  return data_question
}
