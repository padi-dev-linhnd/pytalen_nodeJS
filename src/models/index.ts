import { SequelizeOptions, Sequelize } from 'sequelize-typescript'
import { Dialect } from 'sequelize'
import { env } from '@env'

const { db } = env

const sequelizeOptions: SequelizeOptions = {
  dialect: db.dialect as Dialect,
  host: db.host,
  port: db.port,
  storage: db.storage,
  models: [__dirname + '/entities'],
  modelMatch: (filename, member) => {
    return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase()
  },
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    underscored: true,
    freezeTableName: true,
  },
  pool: {
    min: 0,
    max: 5,
  },
  logQueryParameters: env.node === 'development',
  logging: db.logging,
  benchmark: true,
}

const sequelize = new Sequelize(db.database, db.username, db.password, sequelizeOptions)

const DB = {
  sequelize,
  ...sequelize.models,
}

export default DB
