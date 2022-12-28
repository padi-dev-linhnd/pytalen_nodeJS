import {
  Column,
  CreatedAt,
  Model,
  PrimaryKey,
  Table,
  HasMany,
  UpdatedAt,
  BelongsToMany,
} from 'sequelize-typescript'
import Hr_gametype from './hrgametype.entity'
import Gametype from './gametype.entity'
import Assessment from './assessment.entity'

@Table({
  tableName: 'hr',
})
export default class Hr extends Model<Hr> {
  @PrimaryKey
  @Column
  id!: number

  @Column
  user_name!: string

  @Column
  email!: string

  @Column
  role!: string

  @Column
  password!: string

  @Column
  token!: string

  @Column
  company!: string

  @Column
  company_size!: string

  @Column
  company_industry!: string

  @Column
  company_logo!: string

  @BelongsToMany(() => Gametype, () => Hr_gametype)
  Gametype!: Gametype[]

  @HasMany(() => Assessment)
  Assessment!: Assessment[]

  @CreatedAt
  @Column
  createdAt!: Date

  @UpdatedAt
  @Column
  updatedAt!: Date
}
