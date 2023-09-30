'use strict';
const { DataTypes } = require('sequelize')
const { ORDER_TABLE } = require("../models/orderModel")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(ORDER_TABLE, 'state', {
      type: DataTypes.ENUM(["pedido nuevo", "alistamiento", "verificando pago", "en ruta", "rechazado", "entregado"]),
      allowNull: false,
      defaultValue: 'pedido nuevo'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(ORDER_TABLE, 'state')
  }
};
