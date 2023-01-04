import {
  Column,
  CreatedAt,
  Model,
  PrimaryKey,
  Table,
  ForeignKey,
  UpdatedAt,
  BelongsTo,
} from 'sequelize-typescript'
import Gametype from './gametype.entity'
import Question from './question.entity'
import Candidate from './candidate.entity'
import Assessment from './assessment.entity'

@Table({
  tableName: 'result',
})
export default class Result extends Model<Result> {
  @PrimaryKey
  @Column
  id!: number

  @ForeignKey(() => Gametype)
  @Column
  gametype_id!: number

  @BelongsTo(() => Gametype)
  Gametype!: Gametype

  // nhieu mot voi question
  @ForeignKey(() => Question)
  @Column
  question_id!: number

  @BelongsTo(() => Question)
  Question!: Question
  // ---------------------

  // nhieu - mot voi candidate
  @ForeignKey(() => Candidate)
  @Column
  candidate_id!: number

  @BelongsTo(() => Candidate)
  Candidate!: Candidate
  // ---------------------

  @ForeignKey(() => Assessment)
  @Column
  assessment_id!: number

  @BelongsTo(() => Assessment)
  Assessment!: Assessment

  @Column
  answer: string

  @Column
  status: boolean

  @Column
  point: number

  @CreatedAt
  @Column
  createdAt!: Date

  @UpdatedAt
  @Column
  updatedAt!: Date
}
