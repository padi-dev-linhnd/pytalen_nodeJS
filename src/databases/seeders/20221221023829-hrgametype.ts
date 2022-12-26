const hr_gametype = [
  {
    id: 1,
    hr_id: 1,
    gametype_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('hr_gametype', hr_gametype, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('hr_gametype', {
      id: hr_gametype.map((collection) => collection.id),
    })
  },
}
