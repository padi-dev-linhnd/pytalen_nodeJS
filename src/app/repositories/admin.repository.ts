import Admin from '@models/entities/admin.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { AdminRepositoryInterface } from './interfaces/admin.repository.interface'
import { ModelContainer } from '@decorators/model.decorator'
@Service({ global: true })
class AdminRepository extends BaseRepository<Admin> implements AdminRepositoryInterface<Admin> {
  constructor(@ModelContainer(Admin.tableName) Admin: ModelCtor<Admin>) {
    super(Admin)
  }
}

export default AdminRepository
