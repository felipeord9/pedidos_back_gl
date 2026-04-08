'use strict';
const { DataTypes } = require('sequelize')
const { USER_TABLE } = require("../models/userModel")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(USER_TABLE, 'co', {
      type: DataTypes.STRING,
      allowNull: true,
    })
  },

  async down (queryInterface, Sequelize) {
  }
};
