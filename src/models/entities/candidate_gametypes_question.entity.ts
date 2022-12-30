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

@Table({
  tableName: 'candidate_gametypes_question',
})
export default class Candidate_gametypes_question extends Model<Candidate_gametypes_question> {
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

  @CreatedAt
  @Column
  createdAt!: Date

  @UpdatedAt
  @Column
  updatedAt!: Date
}
