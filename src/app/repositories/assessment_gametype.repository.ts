import Assessment_gametype from '@models/entities/assessment_gametype.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { AssessmentGametypeRepositoryInterface } from './interfaces/assessment_gametype.repository.interface'
import { ModelContainer } from '@decorators/model.decorator'

@Service({ global: true })
class AssessmentGametypeRepository
  extends BaseRepository<Assessment_gametype>
  implements AssessmentGametypeRepositoryInterface<Assessment_gametype>
{
  constructor(
    @ModelContainer(Assessment_gametype.tableName)
    Assessment_gametype: ModelCtor<Assessment_gametype>,
  ) {
    super(Assessment_gametype)
  }
}

export default AssessmentGametypeRepository
