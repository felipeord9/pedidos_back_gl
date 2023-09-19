"use strict";

const { PRODUCT_TABLE, ProductSchema } = require("../models/productModel");
const { AGENCY_TABLE, AgencySchema } = require("../models/agencyModel");
const { CLIENT_TABLE, ClientSchema } = require("../models/clientModel");
const { SELLER_TABLE, SellerSchema } = require("../models/sellerModel");
const { BRANCH_TABLE, BranchSchema} = require('../models/branchModel')
const { ORDER_TABLE, OrderSchema} = require('../models/orderModel')
const { ORDER_PRODUCT_TABLE, OrderProductSchema} = require('../models/order-productModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(PRODUCT_TABLE, ProductSchema);
    await queryInterface.createTable(AGENCY_TABLE, AgencySchema);
    await queryInterface.createTable(CLIENT_TABLE, ClientSchema);
    await queryInterface.createTable(SELLER_TABLE, SellerSchema)
    await queryInterface.createTable(BRANCH_TABLE, BranchSchema)
    await queryInterface.createTable(ORDER_TABLE, OrderSchema)
    await queryInterface.createTable(ORDER_PRODUCT_TABLE, OrderProductSchema)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(PRODUCT_TABLE);
    await queryInterface.dropTable(AGENCY_TABLE);
    await queryInterface.dropTable(CLIENT_TABLE);
    await queryInterface.dropTable(SELLER_TABLE)
    await queryInterface.dropTable(BRANCH_TABLE)
    await queryInterface.dropTable(ORDER_TABLE)
    await queryInterface.dropTable(ORDER_PRODUCT_TABLE)
  },
};
