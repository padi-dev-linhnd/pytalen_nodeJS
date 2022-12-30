const candidate_gametypes_question = [
  {
    id: 1,
    gametype_id: 1,
    candidate_id: 1,
    question_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'candidate_gametypes_question',
      candidate_gametypes_question,
      {},
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('candidate_gametypes_question', {
      id: candidate_gametypes_question.map((collection) => collection.id),
    })
  },
}
