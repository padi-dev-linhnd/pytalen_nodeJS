const assessment_gametype = [
  {
    id: 1,
    assessment_id: 1,
    gametype_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    assessment_id: 1,
    gametype_id: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('assessment_gametype', assessment_gametype, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('assessment_gametype', {
      id: assessment_gametype.map((collection) => collection.id),
    })
  },
}
