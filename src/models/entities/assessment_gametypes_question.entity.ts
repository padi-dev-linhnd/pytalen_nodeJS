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
import Assessment from './assessment.entity'
import Gametype from './gametype.entity'
import Question from './question.entity'

@Table({
  tableName: 'assessment_gametypes_question',
})
export default class Assessment_gametypes_question extends Model<Assessment_gametypes_question> {
  @PrimaryKey
  @Column
  id!: number

  @ForeignKey(() => Assessment)
  @Column
  assessment_id!: number

  @ForeignKey(() => Gametype)
  @Column
  gametype_id!: number

  @ForeignKey(() => Question)
  @Column
  question_id!: number

  @BelongsTo(() => Question)
  Question!: Question

  @CreatedAt
  @Column
  createdAt!: Date

  @UpdatedAt
  @Column
  updatedAt!: Date
}
