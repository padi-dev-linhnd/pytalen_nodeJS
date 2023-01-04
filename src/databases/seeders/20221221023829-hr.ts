const hr = [
  {
    id: 1,
    user_name: 'Nguyen Danh Linh',
    email: 'linhnd@paditech.com',
    role: 'hr',
    password: '$2b$10$QodJlRAWD.RGjSx9iJV1NeirSUJdLObYh7L3kBROaPOUGCAh75Keq',
    company: 'paditech',
    company_size: 'size company',
    company_industry: 'industry company',
    company_logo: 'link logo company',
    created_at: new Date(),
    updated_at: new Date(),
  },
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('hr', hr, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('hr', {
      id: hr.map((collection) => collection.id),
    })
  },
}
