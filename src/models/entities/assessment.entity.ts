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
  HasMany,
} from 'sequelize-typescript'
import Hr from './hr.entity'
import Gametype from './gametype.entity'
import Assessment_gametype from './assessment_gametype.entity'
import Candidate from './candidate.entity'
import Invite from './invite.entity'
import Result from './result.entity'

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
  start_date: string

  @Column
  end_date: string

  @Column
  locked!: boolean

  // nhieu - mot hr
  @ForeignKey(() => Hr)
  @Column
  hr_id!: number

  @BelongsTo(() => Hr)
  Hr!: Hr
  // -----------------

  // nhieu - nhieu gametype = assessment_gametype
  @BelongsToMany(() => Gametype, () => Assessment_gametype)
  Gametype!: Gametype[]
  // -------------------------------------------

  @BelongsToMany(() => Candidate, () => Invite)
  Candidate!: Candidate[]

  @HasMany(() => Result)
  Result!: Result[]

  @CreatedAt
  @Column
  createdAt!: Date

  @UpdatedAt
  @Column
  updatedAt!: Date
}
