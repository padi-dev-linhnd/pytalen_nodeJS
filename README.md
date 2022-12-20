# Idolly backend

## Run the project

To run the project locally, run the following command one by one

```
yarn install
yarn db:refresh
yarn dev
```

Sample api

```
localhost:3000/api/v1/user/list
```

## Setting env file

ENV file names will be different in different environments.

At the moment, we have 4 environments:

| Environment | ENV file name          | Usage                                                     |
| :---------- | :--------------------- | :-------------------------------------------------------- |
| Development | .env.development.local | For developers's local environment                        |
| Test        | .env.test.local        | For jest test, please do not modify this file             |
| Staging     | .env.staging.local     | For staging server, you have to create this file yourself |
| Production  | env.production.local   | For production server, you have to create this yourself   |

> Note: `ENV file name === ".env.${process.env.NODE_ENV || 'development'}.local"`

## Other note

### For windows users

> If you are using windows OS you may want to see below thread for run `npm script` smoothy </br> > https://stackoverflow.com/questions/23243353/how-to-set-shell-for-npm-run-scripts-in-windows
