import Assessment from '@models/entities/assessment.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { AssessmentRepositoryInterface } from './interfaces/assessment.repository.interface'
import { ModelContainer } from '@decorators/model.decorator'

@Service({ global: true })
class AssessmentRepository
  extends BaseRepository<Assessment>
  implements AssessmentRepositoryInterface<Assessment>
{
  constructor(@ModelContainer(Assessment.tableName) Assessment: ModelCtor<Assessment>) {
    super(Assessment)
  }
}

export default AssessmentRepository
