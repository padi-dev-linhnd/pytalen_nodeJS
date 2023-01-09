import Question from '@models/entities/question.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { QuestionRepositoryInterface } from './interfaces/question.repository.interface'
import { ModelContainer } from '@decorators/model.decorator'

@Service({ global: true })
class QuestionRepository
  extends BaseRepository<Question>
  implements QuestionRepositoryInterface<Question>
{
  constructor(@ModelContainer(Question.tableName) Question: ModelCtor<Question>) {
    super(Question)
  }
}

export default QuestionRepository
