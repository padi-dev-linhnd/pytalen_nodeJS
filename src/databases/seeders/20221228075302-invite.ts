const invite = [
  {
    id: 1,
    hr_id: 1,
    candidate_id: 1,
    assessment_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('invite', invite, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('invite', {
      id: invite.map((collection) => collection.id),
    })
  },
}
