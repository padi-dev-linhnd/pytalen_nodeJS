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
        allowNull: true,
        defaultValue: '3000-01-01 00:00:00 +00:00',
      },

      end_date: {
        type: Sequelize.STRING(255),
        field: 'end_date',
        allowNull: true,
        defaultValue: '2023-01-01 00:00:00 +00:00',
      },

      locked: {
        type: Sequelize.BOOLEAN(false),
        field: 'locked',
        allowNull: true,
        defaultValue: false,
      },

      hr_id: {
        type: Sequelize.INTEGER,
        field: 'hr_id',
        allowNull: true,
        onDelete: 'SET NULL',
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
