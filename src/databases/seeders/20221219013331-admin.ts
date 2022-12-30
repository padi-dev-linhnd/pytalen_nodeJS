const admin = [
  {
    id: 1,
    user_name: 'Nguyen Danh Linh',
    email: 'linhnd@paditech.com',
    role: 'admin',
    password: 'ndl20092001',
    created_at: new Date(),
    updated_at: new Date(),
  },
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('admin', admin, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('admin', {
      id: admin.map((collection) => collection.id),
    })
  },
}
