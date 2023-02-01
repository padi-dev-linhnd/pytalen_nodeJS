const result = [
  {
    id: 1,
    gametype_id: 1,
    candidate_id: 1,
    question_id: 21,
    assessment_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    gametype_id: 2,
    candidate_id: 1,
    question_id: 1,
    assessment_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('result', result, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('result', {
      id: result.map((collection) => collection.id),
    })
  },
}
