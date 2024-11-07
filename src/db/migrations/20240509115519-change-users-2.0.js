'use strict';
const { USER_TABLE, UserSchema } = require("../models/userModel");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const enumValues = ["vendedor", "agencia", "admin" , "aprobador"];
    return queryInterface.addColumn(USER_TABLE, 'role2', {
      type: Sequelize.ENUM,
      values: enumValues,
      defaultValue: 'vendedor' // Puedes cambiar esto según tus necesidades
    }).then(() => {
      // Copia los datos de la columna original a la nueva columna ENUM
      return queryInterface.sequelize.query(`
        UPDATE USER_TABLE
        SET role2 = role
      `)
      .then(()=>{
        //borrar columna role vieja
        return queryInterface.removeColumn(USER_TABLE,'role')
      })
      .then(()=>{
        //renombrar columna nueva a role
        return queryInterface.renameColumn(USER_TABLE,'role2','role')
      })
    })

  },

  async down (queryInterface, Sequelize) {
    return queryInterface.addColumn(USER_TABLE, 'role', {
      type: Sequelize.STRING
    }).then(() => {
      // Copia los datos de la columna ENUM a la columna original
      return queryInterface.sequelize.query(`
        UPDATE USER_TABLE
        SET role = role2
      `);
    }).then(() => {
      // Elimina la columna ENUM
      return queryInterface.removeColumn(USER_TABLE, 'role2');
    });
  }
};
/* 'use strict';
const { USER_TABLE, UserSchema } = require("../models/userModel");

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn(USER_TABLE,'role')
    await queryInterface.removeColumn(USER_TABLE,'role2.0')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(USER_TABLE,'role')
    await queryInterface.removeColumn(USER_TABLE,'role2.0')
  }
}; */

