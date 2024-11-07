'use strict';
const { USER_TABLE, UserSchema } = require("../models/userModel");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /* const enumValues = ["vendedor", "agencia", "admin" , "aprobador","precios"];
    queryInterface.addColumn(USER_TABLE, 'role2', {
      type: Sequelize.ENUM,
      values: enumValues,
      defaultValue: 'vendedor' 
    })
    queryInterface.removeColumn(USER_TABLE,'role') */
    queryInterface.renameColumn(USER_TABLE,'role2','role')
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.addColumn(USER_TABLE, 'role', {
      type: Sequelize.STRING
    }).then(() => {
      // Elimina la columna ENUM
      return queryInterface.removeColumn(USER_TABLE, 'role2');
    });
  }
};
