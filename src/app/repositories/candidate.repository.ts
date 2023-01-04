import Candidate from '@models/entities/candidate.entity'
import { Service } from 'typedi'
import { ModelCtor } from 'sequelize-typescript'
import { BaseRepository } from './base.repository'
import { CandidateRepositoryInterface } from './interfaces/candidate.repository.interface'
import { ModelContainer } from '@decorators/model.decorator'

@Service({ global: true })
class CandidateRepository
  extends BaseRepository<Candidate>
  implements CandidateRepositoryInterface<Candidate>
{
  constructor(@ModelContainer(Candidate.tableName) Candidate: ModelCtor<Candidate>) {
    super(Candidate)
  }
}

export default CandidateRepository
