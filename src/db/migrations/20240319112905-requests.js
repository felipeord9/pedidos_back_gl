'use strict';
const { REQUEST_TABLE, RequestSchema } = require('../models/requestModel')
const { REQUEST_PRODUCT_TABLE, RequestProductSchema } = require('../models/request-productsModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(REQUEST_TABLE, RequestSchema)
    await queryInterface.createTable(REQUEST_PRODUCT_TABLE, RequestProductSchema)

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(REQUEST_TABLE);
    await queryInterface.dropTable(REQUEST_PRODUCT_TABLE);

  }
};