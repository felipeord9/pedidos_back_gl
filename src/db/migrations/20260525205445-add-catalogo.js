'use strict';
const { CATALOG_PRODUCT_TABLE, CatalogProductSchema } = require('../models/catalog-productsModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(CATALOG_PRODUCT_TABLE, CatalogProductSchema)

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(CATALOG_PRODUCT_TABLE);

  }
};

