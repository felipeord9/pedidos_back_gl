const { Model, DataTypes, Sequelize } = require("sequelize");
const { ORDER_TABLE } = require('./orderModel')
const { PRODUCT_TABLE } = require('./productModel')

const ORDER_PRODUCT_TABLE = 'orders_products'

const OrderProductSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'order_id',
    references: {
      model: ORDER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'product_id',
    references: {
      model: PRODUCT_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}

class OrderProduct extends Model {
  static associate(models) {
    this.belongsTo(models.Order, { as: 'order'})
    this.belongsTo(models.Product, { as: 'product'})
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_PRODUCT_TABLE,
      modelName: 'OrderProduct',
      timestamps: false
    }
  }
}

module.exports = {
  ORDER_PRODUCT_TABLE,
  OrderProductSchema,
  OrderProduct
}