import Invite from '@models/entities/invite.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { InviteRepositoryInterface } from './interfaces/invite.repository.interface'
import { ModelContainer } from '@decorators/model.decorator'
@Service({ global: true })
class InviteRepository extends BaseRepository<Invite> implements InviteRepositoryInterface<Invite> {
  constructor(@ModelContainer(Invite.tableName) Invite: ModelCtor<Invite>) {
    super(Invite)
  }
}

export default InviteRepository
