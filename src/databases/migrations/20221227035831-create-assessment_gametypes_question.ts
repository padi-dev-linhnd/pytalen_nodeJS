'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('assessment_gametypes_question', {
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

      assessment_id: {
        type: Sequelize.INTEGER,
        field: 'assessment_id',
        allowNull: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'assessment',
          key: 'id',
        },
      },

      question_id: {
        type: Sequelize.INTEGER,
        field: 'question_id',
        allowNull: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'question',
          key: 'id',
        },
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
    await queryInterface.dropTable('assessment_gametypes_question')
  },
}
