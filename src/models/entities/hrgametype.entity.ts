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
import Hr from './hr.entity'
import Gametype from './gametype.entity'

@Table({
  tableName: 'hr_gametype',
})
export default class Hr_gametype extends Model<Hr_gametype> {
  @PrimaryKey
  @Column
  id!: number

  @ForeignKey(() => Hr)
  @Column
  hr_id: number

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
