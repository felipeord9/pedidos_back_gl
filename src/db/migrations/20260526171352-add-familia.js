'use strict';
const { FAMILIA_TABLE, FamiliaSchema } = require('../models/familiaModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(FAMILIA_TABLE, FamiliaSchema)

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(FAMILIA_TABLE);

  }
};

