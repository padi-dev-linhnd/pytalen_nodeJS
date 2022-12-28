'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('assessment', {
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

      position: {
        type: Sequelize.STRING(255),
        field: 'position',
        allowNull: false,
      },

      start_date: {
        type: Sequelize.STRING(255),
        field: 'start_date',
        allowNull: false,
      },

      end_date: {
        type: Sequelize.STRING(255),
        field: 'end_date',
        allowNull: false,
      },

      hr_id: {
        type: Sequelize.INTEGER,
        field: 'hr_id',
        allowNull: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'hr',
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
    await queryInterface.dropTable('assessment')
  },
}
