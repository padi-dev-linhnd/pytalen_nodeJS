'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('gametype', {
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

      total_time: {
        type: Sequelize.STRING(255),
        field: 'total_time',
        allowNull: false,
      },

      time_question: {
        type: Sequelize.STRING(255),
        field: 'time_question',
        allowNull: false,
      },

      total_question: {
        type: Sequelize.STRING(255),
        field: 'total_question',
        allowNull: false,
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
    await queryInterface.dropTable('gametype')
  },
}
