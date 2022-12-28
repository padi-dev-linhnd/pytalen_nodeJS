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
import Gametype from './gametype.entity'
import Assessment_Gametype_Question from './assessment_gametypes_question.entity'
import Answer from './answer.entity'

@Table({
  tableName: 'question',
})
export default class Question extends Model<Question> {
  @PrimaryKey
  @Column
  id!: number

  @ForeignKey(() => Gametype)
  @Column
  gametype_id!: number

  @BelongsTo(() => Gametype)
  Gametype!: Gametype

  @Column
  question!: string

  @Column
  level!: number

  @HasMany(() => Assessment_Gametype_Question)
  Assessment_Gametype_Question!: Assessment_Gametype_Question[]

  @HasMany(() => Answer)
  Answer!: Answer[]

  @CreatedAt
  @Column
  createdAt!: Date

  @UpdatedAt
  @Column
  updatedAt!: Date
}
