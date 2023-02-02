const assessment = [
  {
    id: 1,
    name: 'assessment',
    position: 'thuc tap',
    start_date: '2022-12-27 09:45:00',
    end_date: '2022-12-28 09:45:00',
    hr_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: 'assessment2',
    position: 'thuc tap',
    start_date: '2022-12-27 09:45:00',
    end_date: '2022-12-28 09:45:00',
    hr_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('assessment', assessment, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('assessment', {
      id: assessment.map((collection) => collection.id),
    })
  },
}
