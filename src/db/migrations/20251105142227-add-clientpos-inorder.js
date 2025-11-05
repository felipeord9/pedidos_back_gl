'use strict';
const { DataTypes } = require('sequelize')
const { ORDER_TABLE } = require("../models/orderModel")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(ORDER_TABLE, 'client_pos_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
    })
    await queryInterface.addColumn(ORDER_TABLE, 'client_pos_description', {
      type: DataTypes.STRING,
      allowNull: true,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(ORDER_TABLE, 'reason_for_rejection')
    await queryInterface.removeColumn(ORDER_TABLE, 'reason_for_delivery')
  }
};

