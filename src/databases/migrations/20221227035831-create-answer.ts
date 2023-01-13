'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('answer', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      question_id: {
        type: Sequelize.INTEGER,
        field: 'question_id',
        allowNull: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        references: {
          model: 'question',
          key: 'id',
        },
      },

      answer: {
        type: Sequelize.STRING(255),
        field: 'answer',
        allowNull: false,
      },

      correct_answer: {
        type: Sequelize.BOOLEAN(false),
        field: 'correct_answer',
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
    await queryInterface.dropTable('answer')
  },
}
