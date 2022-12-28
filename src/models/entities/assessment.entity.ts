import {
  Column,
  CreatedAt,
  Model,
  ForeignKey,
  PrimaryKey,
  Table,
  UpdatedAt,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript'
import Hr from './hr.entity'
import Gametype from './gametype.entity'
import Assessment_Gametype_Question from './assessment_gametypes_question.entity'

@Table({
  tableName: 'assessment',
})
export default class Assessment extends Model<Assessment> {
  @PrimaryKey
  @Column
  id!: number

  @Column
  name!: string

  @Column
  position!: string

  @Column
  start_date!: string

  @Column
  end_date!: string

  @ForeignKey(() => Hr)
  @Column
  hr_id!: number

  @BelongsTo(() => Hr)
  Hr!: Hr

  @BelongsToMany(() => Gametype, () => Assessment_Gametype_Question)
  Gametype!: Gametype[]

  @CreatedAt
  @Column
  createdAt!: Date

  @UpdatedAt
  @Column
  updatedAt!: Date
}
