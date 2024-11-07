const { User, UserSchema } = require('./userModel')
const { Product, ProductSchema } = require('./productModel')
const { Agency, AgencySchema } = require('./agencyModel')
const { Client, ClientSchema } = require('./clientModel')
const { Seller, SellerSchema } = require('./sellerModel')
const { Branch, BranchSchema } = require('./branchModel')
const { Order, OrderSchema } = require('./orderModel')
const { OrderProduct, OrderProductSchema } = require('./order-productModel')
const { Request, RequestSchema } = require('./requestModel')
const { RequestProduct, RequestProductSchema } = require('./request-productsModel')

function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize))
  Product.init(ProductSchema, Product.config(sequelize))
  Agency.init(AgencySchema, Agency.config(sequelize))
  Client.init(ClientSchema, Client.config(sequelize))
  Seller.init(SellerSchema, Seller.config(sequelize))
  Branch.init(BranchSchema, Branch.config(sequelize))
  Order.init(OrderSchema, Order.config(sequelize))
  OrderProduct.init(OrderProductSchema, OrderProduct.config(sequelize))
  Request.init(RequestSchema, Request.config(sequelize))
  RequestProduct.init(RequestProductSchema, RequestProduct.config(sequelize))


  User.associate(sequelize.models)
  Product.associate(sequelize.models)
  Agency.associate(sequelize.models)
  Client.associate(sequelize.models)
  Seller.associate(sequelize.models)
  Branch.associate(sequelize.models)
  Order.associate(sequelize.models)
  OrderProduct.associate(sequelize.models)
  Request.associate(sequelize.models)
  RequestProduct.associate(sequelize.models)

}

module.exports = setupModels