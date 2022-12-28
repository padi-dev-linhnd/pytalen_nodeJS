const assessment_gametypes_question = [
  {
    id: 1,
    gametype_id: 1,
    assessment_id: 1,
    question_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'assessment_gametypes_question',
      assessment_gametypes_question,
      {},
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('assessment_gametypes_question', {
      id: assessment_gametypes_question.map((collection) => collection.id),
    })
  },
}
