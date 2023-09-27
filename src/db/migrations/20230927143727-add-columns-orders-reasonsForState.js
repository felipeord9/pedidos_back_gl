'use strict';
const { DataTypes } = require('sequelize')
const { ORDER_TABLE } = require("../models/orderModel")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(ORDER_TABLE, 'reason_for_rejection', {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'reason_for_rejection'
    })
    await queryInterface.addColumn(ORDER_TABLE, 'reason_for_delivery', {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'reason_for_delivery'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(ORDER_TABLE, 'reason_for_rejection')
    await queryInterface.removeColumn(ORDER_TABLE, 'reason_for_delivery')
  }
};
