const candidate = [
  {
    id: 1,
    email: 'linhnd@paditech.com',
    token: '7f45340040',
    created_at: new Date(),
    updated_at: new Date(),
  },
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('candidate', candidate, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('candidate', {
      id: candidate.map((collection) => collection.id),
    })
  },
}
