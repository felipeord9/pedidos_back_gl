'use strict';
const { DataTypes } = require('sequelize')
const { ORDER_TABLE } = require("../models/orderModel")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(ORDER_TABLE, 'state', {
      type: DataTypes.ENUM(["alistamiento", "verificando pago", "en ruta", "rechazado", "entregado"]),
      allowNull: false,
      defaultValue: 'alistamiento'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(ORDER_TABLE, 'state')
  }
};
