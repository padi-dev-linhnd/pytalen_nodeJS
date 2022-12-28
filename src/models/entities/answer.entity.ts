import {
  Column,
  CreatedAt,
  Model,
  PrimaryKey,
  Table,
  ForeignKey,
  UpdatedAt,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript'
import Question from './question.entity'

@Table({
  tableName: 'answer',
})
export default class Answer extends Model<Answer> {
  @PrimaryKey
  @Column
  id!: number

  @ForeignKey(() => Question)
  @Column
  question_id!: number

  @BelongsTo(() => Question)
  Question!: Question

  @Column
  answer!: string

  @Column
  correct_answer!: boolean

  @CreatedAt
  @Column
  createdAt!: Date

  @UpdatedAt
  @Column
  updatedAt!: Date
}
