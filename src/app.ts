import 'reflect-metadata'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import morgan from 'morgan'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import DB from '@models/index'
import { logger, stream } from '@utils/logger'
import { useExpressServer, useContainer } from 'routing-controllers'
import { Container } from 'typedi'
import path from 'path'
import errorMiddleware from '@middlewares/error.middleware'
import { env } from '@env'

class App {
  public app: express.Application = express()
  public env: string
  public port: string | number

  constructor() {
    this.env = env.node || 'development'
    this.port = env.app.port || 3000

    this.connectToDatabase()
    this.initializeMiddlewares()
    this.initializeRoutes()
    this.initializeSwagger()
    this.initializeErrorHandling()
    // this.register404Page();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`)
      logger.info(`======= ENV: ${this.env} =======`)
      logger.info(`🚀 App listening on the port ${this.port}`)
      logger.info(`=================================`)
    })
  }

  public getServer() {
    return this.app
  }

  private connectToDatabase() {
    DB.sequelize.authenticate()
    // DB.sequelize.sync({ force: false });
  }

  private initializeMiddlewares() {
    this.app.use(morgan(env.log.format, { stream }))
    this.app.use(cors({ origin: env.cors.origin, credentials: env.cors.credentials }))
    this.app.use(hpp())
    this.app.use(helmet())
    this.app.use(compression())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cookieParser())
    this.app.use(express.static(path.join(__dirname, '/public')))
  }

  private initializeRoutes() {
    useContainer(Container)
    useExpressServer(this.app, {
      defaultErrorHandler: false,
      routePrefix: '/api/v1',
      middlewares: [path.join(__dirname, '/app/middleware/*.ts')],
      controllers: [path.join(__dirname, '/app/controllers/*.ts')],
    })
  }

  private register404Page() {
    this.app.get('*', function (req, res) {
      res.status(404).json({ status: 404, message: 'Page Not Found!' })
    })
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    }

    const specs = swaggerJSDoc(options)
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware)
  }
}

export default App
