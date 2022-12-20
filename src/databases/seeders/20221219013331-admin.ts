const admins = [
  {
    id: 1,
    user_name: 'Nguyen Danh Linh',
    email: 'linhnd@paditech.com',
    role: 'admins',
    password: 'ndl20092001',
    token: 'day la token',
    created_at: new Date(),
    updated_at: new Date(),
  },
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('admins', admins, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('admins', {
      id: admins.map((collection) => collection.id),
    })
  },
}
