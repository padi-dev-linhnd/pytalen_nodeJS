'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('question', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      gametype_id: {
        type: Sequelize.INTEGER,
        field: 'gametype_id',
        allowNull: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'gametype',
          key: 'id',
        },
      },

      question: {
        type: Sequelize.STRING(255),
        field: 'question',
        allowNull: false,
      },

      level: {
        type: Sequelize.INTEGER,
        field: 'level',
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
    await queryInterface.dropTable('question')
  },
}
