import Hr from '@models/entities/hr.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { HrRepositoryInterface } from './interfaces/hr.repository.interface'
import { ModelContainer } from '@decorators/model.decorator'
import HrGameType from '@models/entities/hrgametype.entity'
import nodemailer from 'nodemailer'
import Candidate from '@models/entities/candidate.entity'
import crypto from 'crypto'
import Invite from '@models/entities/invite.entity'
import Assessment from '@models/entities/assessment.entity'
import console from 'console'

@Service({ global: true })
class HrRepository extends BaseRepository<Hr> implements HrRepositoryInterface<Hr> {
  constructor(@ModelContainer(Hr.tableName) User: ModelCtor<Hr>) {
    super(User)
  }

  startInvite(email: string, token: string): Promise<any> {
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
      text: `https://localhost:3000/api/v1/candidate?token=${token}`,
    }
    transporter.sendMail(mainOptions)
    return
  }

  async findByEmail(email: string): Promise<Hr> {
    return this.findByCondition({
      where: { email: email },
    })
  }

  async create_Hr(dataReq: any): Promise<Hr> {
    const dataGame = dataReq.Game_type
    delete dataReq.Game_type
    const dataHr = await this.findByEmail(dataReq.email)
    if (dataHr) {
      return null
    }
    await this.create(dataReq)
    const hr_id = (await this.findByEmail(dataReq.email)).id
    dataGame.map((item, index) => {
      dataGame[index] = {
        gametype_id: item,
        hr_id: hr_id,
      }
    })
    await HrGameType.bulkCreate(dataGame)
    return dataReq
  }

  async invite_candidate(dataReq: any): Promise<Hr> {
    const list_email = dataReq.list_email
    delete dataReq.list_email
    const dataHr = await this.getAllWhere({
      where: { id: dataReq.hr_id },
      include: {
        model: Assessment,
        where: { id: dataReq.assessment_id },
      },
    })
    if (dataHr.length == 0) {
      return null
    }
    list_email.forEach(async (item) => {
      const token = crypto.randomBytes(5).toString('hex')
      this.startInvite(item, token)
      const dataCandidate = await Candidate.findAll({
        where: { email: item },
        include: {
          model: Assessment,
          where: { id: dataReq.assessment_id },
        },
      })
      const dataCandidate2: any = await Candidate.findAll({
        where: { email: item },
        raw: true,
        nest: true,
      })
      console.log(dataCandidate2)
      if (dataCandidate2.length > 0) {
        await Invite.create({
          candidate_id: dataCandidate2[0].id,
          hr_id: dataReq.hr_id,
          assessment_id: dataReq.assessment_id,
        })
      } else {
        if (dataCandidate.length > 0) {
          await Candidate.destroy({ where: { email: item } })
        }
        await Candidate.create({ email: item, token: token })
        const candidate_id = (await Candidate.findOne({ where: { email: item, token: token } })).id
        await Invite.create({
          candidate_id: candidate_id,
          hr_id: dataReq.hr_id,
          assessment_id: dataReq.assessment_id,
        })
      }
    })
    return list_email
  }
}

export default HrRepository
