import {
  Column,
  BelongsToMany,
  CreatedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript'
import Assessment from './assessment.entity'
import Invite from './invite.entity'
import Hr from './hr.entity'
import Candidate_gametypes_question from './candidate_gametypes_question.entity'

@Table({
  tableName: 'candidate',
})
export default class Candidate extends Model<Candidate> {
  @PrimaryKey
  @Column
  id!: number

  @Column
  email!: string

  @Column
  token!: string

  // nhieu - nhieu voi assessment va hr
  @BelongsToMany(() => Assessment, () => Invite)
  Assessment!: Assessment[]

  @BelongsToMany(() => Hr, () => Invite)
  Hr!: Hr[]
  // ----------------------------------

  // mot nhieu Candidate_gametypes_question
  @HasMany(() => Candidate_gametypes_question)
  Candidate_gametypes_question!: Candidate_gametypes_question[]
  // -----------------------------------

  @CreatedAt
  @Column
  createdAt!: Date

  @UpdatedAt
  @Column
  updatedAt!: Date
}
