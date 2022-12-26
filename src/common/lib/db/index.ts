import { ModelCtor } from 'sequelize-typescript'

import DB from '@models/index'
import User from '@models/entities/users.entity'
import Admin from '@models/entities/admin.entity'
import Hr from '@models/entities/hr.entity'
import Gametype from '@models/entities/gametype.entity'
import Hrgametype from '@models/entities/hrgametype.entity'

export function getModelFromTableName(tableName: string): ModelCtor | undefined {
  let item = undefined
  switch (tableName) {
    case User.tableName:
      item = DB.sequelize.model(User)
      break
    case Admin.tableName:
      item = DB.sequelize.model(Admin)
      break
    case Hr.tableName:
      item = DB.sequelize.model(Hr)
      break
    case Gametype.tableName:
      item = DB.sequelize.model(Gametype)
      break
    case Hrgametype.tableName:
      item = DB.sequelize.model(Hrgametype)
      break
    default:
      item = undefined
      break
  }
  return item
}
