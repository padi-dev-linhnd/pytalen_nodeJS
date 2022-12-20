import { Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript'

@Table({
  tableName: 'users',
})
export default class User extends Model<User> {
  @PrimaryKey
  @Column
  id!: number

  @Column
  name!: string

  @Column
  email!: string

  @Column
  password!: string

  @CreatedAt
  @Column
  createdAt!: Date

  @UpdatedAt
  @Column
  updatedAt!: Date
}
