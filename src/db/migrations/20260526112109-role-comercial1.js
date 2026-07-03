'use strict';

const { USER_TABLE, UserSchema } = require("../models/userModel");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "ALTER TYPE \"enum_users_role3\" ADD VALUE 'comercial';"
    );
  },

  async down (queryInterface, Sequelize) {
    //
  }
};
