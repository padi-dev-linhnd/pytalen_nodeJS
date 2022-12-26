import { Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript'

@Table({
  tableName: 'admin',
})
export default class Admin extends Model<Admin> {
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

  @CreatedAt
  @Column
  createdAt!: Date

  @UpdatedAt
  @Column
  updatedAt!: Date
}
