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
import Hr from './hr.entity'
import Candidate from './candidate.entity'

@Table({
  tableName: 'invite',
})
export default class Invite extends Model<Invite> {
  @PrimaryKey
  @Column
  id!: number

  @ForeignKey(() => Assessment)
  @Column
  assessment_id!: number

  @ForeignKey(() => Candidate)
  @Column
  candidate_id!: number

  @ForeignKey(() => Hr)
  @Column
  hr_id!: number

  @CreatedAt
  @Column
  createdAt!: Date

  @UpdatedAt
  @Column
  updatedAt!: Date
}
