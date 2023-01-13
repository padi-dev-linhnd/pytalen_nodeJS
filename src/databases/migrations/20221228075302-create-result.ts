'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('result', {
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
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        references: {
          model: 'gametype',
          key: 'id',
        },
      },

      candidate_id: {
        type: Sequelize.INTEGER,
        field: 'candidate_id',
        allowNull: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        references: {
          model: 'candidate',
          key: 'id',
        },
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

      assessment_id: {
        type: Sequelize.INTEGER,
        field: 'assessment_id',
        allowNull: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        references: {
          model: 'assessment',
          key: 'id',
        },
      },

      answer: {
        type: Sequelize.STRING(255),
        field: 'answer',
        allowNull: true,
      },

      status: {
        type: Sequelize.BOOLEAN(false),
        field: 'status',
        allowNull: true,
      },

      point: {
        type: Sequelize.INTEGER,
        field: 'point',
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
    await queryInterface.dropTable('result')
  },
}
