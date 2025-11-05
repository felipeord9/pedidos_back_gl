'use strict';
const { CLIENT_POS_TABLE, ClientPosSchema } = require('../models/clients-posModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(CLIENT_POS_TABLE, ClientPosSchema)

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(CLIENT_POS_TABLE);

  }
};

