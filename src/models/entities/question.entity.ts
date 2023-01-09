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
import Result from './result.entity'
import Answer from './answer.entity'

@Table({
  tableName: 'question',
})
export default class Question extends Model<Question> {
  @PrimaryKey
  @Column
  id!: number

  // nhieu mot voi gametype
  @ForeignKey(() => Gametype)
  @Column
  gametype_id!: number

  @BelongsTo(() => Gametype)
  Gametype!: Gametype
  // ----------------------

  @Column
  question!: string

  @Column
  level!: number

  @Column
  point: number

  // mot nhieu voi Result
  @HasMany(() => Result)
  Result!: Result[]
  // ---------------------------

  // mot - nhieu answer
  @HasMany(() => Answer)
  Answer!: Answer[]
  // ------------------

  @CreatedAt
  @Column
  createdAt!: Date

  @UpdatedAt
  @Column
  updatedAt!: Date
}
