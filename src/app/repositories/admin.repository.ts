import Admin from '@models/entities/admin.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { AdminRepositoryInterface } from './interfaces/admin.repository.interface'
import { ModelContainer } from '@decorators/model.decorator'
import jwt, { Secret, JwtPayload } from 'jsonwebtoken'

@Service({ global: true })
class AdminRepository extends BaseRepository<Admin> implements AdminRepositoryInterface<Admin> {
  constructor(@ModelContainer(Admin.tableName) Admin: ModelCtor<Admin>) {
    super(Admin)
  }

  async findByEmail(email: string): Promise<Admin> {
    return this.findByCondition({
      where: { email: email },
      attributes: {
        exclude: ['id', 'password', 'createdAt', 'updatedAt'],
      },
    })
  }

  async AdminLogin(dataReq: object): Promise<Admin> {
    const dataDB = await this.findByCondition({
      where: { email: dataReq.email, password: dataReq.password },
      attributes: {
        exclude: ['token', 'password', 'createdAt', 'updatedAt'],
      },
      raw: true,
      nest: true,
    })
    if (!dataDB) return null
    else {
      const token = jwt.sign(dataDB, process.env.JWT_SECRET)
      await this.update({ token: token }, { where: { id: 1 } })
      dataDB.token = token
      return dataDB
    }
  }

  async AdminLogout(accessToken: string): Promise<Admin> {
    return this.update({ token: null }, { where: { token: accessToken } })
  }
}

export default AdminRepository
