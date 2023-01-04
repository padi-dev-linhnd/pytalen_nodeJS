const admin = [
  {
    id: 1,
    user_name: 'Nguyen Danh Linh',
    email: 'linhnd@paditech.com',
    role: 'admin',
    password: '$2b$10$W892ejPEqt7sWndaEfH6POQYsPC5gWGe4ezjQtGyir2N29swqmGWq',
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
