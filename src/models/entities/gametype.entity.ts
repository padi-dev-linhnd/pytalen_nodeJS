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

  @BelongsToMany(() => Hr, () => Hr_gametype)
  Hr!: Hr[]

  @CreatedAt
  @Column
  createdAt!: Date

  @UpdatedAt
  @Column
  updatedAt!: Date
}
