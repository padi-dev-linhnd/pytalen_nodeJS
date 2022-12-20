'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('admins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_name: {
        type: Sequelize.STRING(255),
        field: 'user_name',
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING(255),
        field: 'email',
        allowNull: false,
      },

      role: {
        type: Sequelize.STRING(255),
        field: 'role',
        allowNull: false,
      },

      password: {
        type: Sequelize.TEXT,
        field: 'password',
        allowNull: false,
      },

      token: {
        type: Sequelize.TEXT,
        field: 'token',
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        field: 'created_at',
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        field: 'updated_at',
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('admins')
  },
}
