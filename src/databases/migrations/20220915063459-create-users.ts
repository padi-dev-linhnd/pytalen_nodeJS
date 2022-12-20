module.exports = {
  up: async (QueryInterface, Sequelize) => {
    await QueryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      name: {
        type: Sequelize.STRING(255),
        field: 'name',
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING(255),
        field: 'email',
        allowNull: false,
      },

      password: {
        type: Sequelize.TEXT,
        field: 'password',
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at',
      },
    })

    await Promise.all([
      QueryInterface.addIndex('users', ['email'], {
        name: ['users', 'email', 'unique'].join('_'),
        indicesType: 'unique',
        type: 'unique',
      }),
    ])
  },

  down: async (queryInterface) => queryInterface.dropTable('users'),
}
