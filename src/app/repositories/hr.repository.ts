import Hr from '@models/entities/hr.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { HrRepositoryInterface } from './interfaces/hr.repository.interface'
import { ModelContainer } from '@decorators/model.decorator'
import HrGameType from '@models/entities/hrgametype.entity'
import Candidate from '@models/entities/candidate.entity'
import crypto from 'crypto'
import Invite from '@models/entities/invite.entity'
import {
  check_email,
  hash_password,
  format_gametype,
  format_hr,
  check_gametype,
  check_hr_asessment,
  check_candidate,
  check_candidate_invite,
  format_invite,
  Invite_candidate,
  format_dataReq_hr,
} from '@service/all_service.service'

@Service({ global: true })
class HrRepository extends BaseRepository<Hr> implements HrRepositoryInterface<Hr> {
  constructor(@ModelContainer(Hr.tableName) User: ModelCtor<Hr>) {
    super(User)
  }

  async findByEmail(email: string): Promise<Hr> {
    return this.findByCondition({
      where: { email: email },
    })
  }

  async create_Hr(dataReq: any): Promise<any> {
    const check: any = await check_email(dataReq.email)
    if (check == true) return 'email da ton tai'
    const data_gametype = dataReq.Game_type
    const check2: any = await check_gametype(data_gametype)
    if (check2 == false) return 'list gametype nhap vao khong hop le'
    const dataHr: any = format_hr(dataReq)
    await this.create(dataHr)
    const hr_id = (await this.findByEmail(dataReq.email)).id
    const dataGametype = format_gametype(data_gametype, hr_id)
    await HrGameType.bulkCreate(dataGametype)
    return dataReq
  }

  async invite_candidate(dataReq: any, accessToken: any): Promise<any> {
    const list_email = dataReq.list_email
    delete dataReq.list_email

    const dataformat = format_dataReq_hr(dataReq, accessToken)
    if (typeof dataformat === 'string') return dataformat

    const dataHr = await check_hr_asessment(dataReq)
    if (typeof dataHr === 'string') return dataHr

    list_email.forEach(async (item) => {
      const id_candidate = await check_candidate(item)
      if (id_candidate != -1) {
        const candidate_token = (await Candidate.findOne({ where: { id: id_candidate } })).token
        Invite_candidate(item, candidate_token)
        const check_invite = await check_candidate_invite(dataReq, id_candidate)
        if (check_invite == false) {
          await Invite.create(format_invite(dataReq, id_candidate))
        }
      } else {
        const token = crypto.randomBytes(5).toString('hex')
        Invite_candidate(item, token)
        await Candidate.create({ email: item, token: token })
        const candidate_id = (await Candidate.findOne({ where: { email: item, token: token } })).id
        await Invite.create(format_invite(dataReq, candidate_id))
      }
    })
    return list_email
  }
}

export default HrRepository
