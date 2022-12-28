import { ModelCtor } from 'sequelize-typescript'

import DB from '@models/index'
import User from '@models/entities/users.entity'
import Admin from '@models/entities/admin.entity'
import Hr from '@models/entities/hr.entity'
import Gametype from '@models/entities/gametype.entity'
import Hrgametype from '@models/entities/hrgametype.entity'
import Assessment from '@models/entities/assessment.entity'
import Assessment_gametypes_question from '@models/entities/assessment_gametypes_question.entity'
import Question from '@models/entities/question.entity'
import Answer from '@models/entities/answer.entity'

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
    case Assessment.tableName:
      item = DB.sequelize.model(Assessment)
      break
    case Assessment_gametypes_question.tableName:
      item = DB.sequelize.model(Assessment_gametypes_question)
      break
    case Question.tableName:
      item = DB.sequelize.model(Question)
      break
    case Answer.tableName:
      item = DB.sequelize.model(Answer)
      break
    default:
      item = undefined
      break
  }
  return item
}
