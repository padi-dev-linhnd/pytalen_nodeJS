const gametype = [
  {
    id: 1,
    name: 'Memory',
    total_time: 'Depending on level',
    total_question: 'Depending on level',
    time_question: 'Depending on level',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: 'Logical',
    total_time: '200',
    total_question: '10',
    time_question: '20',
    created_at: new Date(),
    updated_at: new Date(),
  },
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('gametype', gametype, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('gametype', {
      id: gametype.map((collection) => collection.id),
    })
  },
}
