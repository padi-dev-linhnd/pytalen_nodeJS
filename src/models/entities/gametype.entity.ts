import {
  Column,
  CreatedAt,
  Model,
  PrimaryKey,
  HasMany,
  Table,
  UpdatedAt,
  BelongsToMany,
} from 'sequelize-typescript'
import Hr_gametype from './hrgametype.entity'
import Hr from './hr.entity'
import Assessment from './assessment.entity'
import Assessment_gametype from './assessment_gametype.entity'
import Question from './question.entity'
import Result from './result.entity'

@Table({
  tableName: 'gametype',
})
export default class Gametype extends Model<Gametype> {
  @PrimaryKey
  @Column
  id!: number

  @Column
  name!: string

  @Column
  total_time!: string

  @Column
  time_question!: string

  @Column
  total_question!: string

  // nhieu nhieu voi hr = hr_gametype
  @BelongsToMany(() => Hr, () => Hr_gametype)
  Hr!: Hr[]
  // ---------------------------

  // nhieu - nhieu assessment = assessment_gametype
  @BelongsToMany(() => Assessment, () => Assessment_gametype)
  Assessment!: Assessment[]
  // -----------------------------------------

  // mot nhieu Result
  @HasMany(() => Result)
  Result!: Result[]
  // -----------------------------------

  // mot nhieu voi questionwqefweqf
  @HasMany(() => Question)
  Question!: Question[]
  // --------------------

  @CreatedAt
  @Column
  createdAt!: Date

  @UpdatedAt
  @Column
  updatedAt!: Date
}
