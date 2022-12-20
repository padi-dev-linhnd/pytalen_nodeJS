const wrapValuesWithDateTime = require('../utils/wrapValuesWithDateTime.ts')

const users = [
  {
    id: 1,
    name: 'name user 1',
    email: 'user01@example.com',
    password: '$2b$10$uAAaPu7svUAz8XLjEApZoOTL3/zYUTAj1VSz82HRozhWpJdbT7y1S',
  },

  // {
  //   id: 2,
  //   name: 'name user 2',
  //   email: 'user02@example.com',
  //   password: '$2b$10$SuNanIIQKwWnjPdpRAgsqOq9QusGks6kjMbPuiPc1dMjqlFvjU1Bq',
  // },

  // {
  //   id: 3,
  //   name: 'name user 3',
  //   email: 'user03@example.com',
  //   password: '$2b$10$tyeJwA/5AXJQogXIrDwDweO4.8s2Es5ICR.gFp6bNFoDsfJ3bbe9u',
  // },
]

module.exports = {
  async up(queryInterface) {
    return [await queryInterface.bulkInsert('users', wrapValuesWithDateTime(users))]
  },

  async down(queryInterface) {
    return [
      await queryInterface.bulkDelete('users', {
        id: users.map((collection) => collection.id),
      }),
    ]
  },
}

/*
import { hash } from 'bcrypt';
Promise.all(
    [
        'password01',
        'password02',
        'password03',
    ].map( it =>  hash(it, 10))
).then(it => console.log('>>>>>>>>>>>>>>>>>', it))
*/
