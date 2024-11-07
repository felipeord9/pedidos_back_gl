const { Model, DataTypes, Sequelize } = require("sequelize");
const { REQUEST_TABLE } = require('./requestModel')
const { PRODUCT_TABLE } = require('./productModel')

const REQUEST_PRODUCT_TABLE = 'request_products'

const RequestProductSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cost: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  priceAuth: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'price_auth',
  },
  currentMargen:{
    type: DataTypes.STRING,
    allowNull: false,
    field: 'current_margen',
  },
  newMargen:{
    type: DataTypes.STRING,
    allowNull: false,
    field: 'new_margen',
  },
  requestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'request_id',
    references: {
      model: REQUEST_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'product_id',
  },
  state: {
    type: DataTypes.STRING,
    allowNull:true,
  },
  reasonForRejection: {
    type: DataTypes.STRING,
    allowNull:true,
  }
}

class RequestProduct extends Model {
  static associate(models) {
    this.belongsTo(models.Request, { as: 'request'})
    //this.belongsTo(models.Product, { as: 'product'})
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: REQUEST_PRODUCT_TABLE,
      modelName: 'RequestProduct',
      timestamps: false
    }
  }
}

module.exports = {
  REQUEST_PRODUCT_TABLE,
  RequestProductSchema,
  RequestProduct
}