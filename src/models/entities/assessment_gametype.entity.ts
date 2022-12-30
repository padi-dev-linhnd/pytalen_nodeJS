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

@Table({
  tableName: 'assessment_gametype',
})
export default class Assessment_gametype extends Model<Assessment_gametype> {
  @PrimaryKey
  @Column
  id!: number

  @ForeignKey(() => Assessment)
  @Column
  assessment_id: number

  @ForeignKey(() => Gametype)
  @Column
  gametype_id: number

  @CreatedAt
  @Column
  createdAt!: Date

  @UpdatedAt
  @Column
  updatedAt!: Date
}
