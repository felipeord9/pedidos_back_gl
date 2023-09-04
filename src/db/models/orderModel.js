const { Model, DataTypes, Sequelize } = require("sequelize");
const { CLIENT_TABLE } = require("./clientModel");
const { SELLER_TABLE } = require("./sellerModel");
const { BRANCH_TABLE } = require("./branchModel");

const ORDER_TABLE = "orders";

const OrderSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  deliveryDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'delivery_field'
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  purchaseOrder: {
    type:DataTypes.STRING,
    allowNull: true,
    field: 'purchase_order'
  },
  clientId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: "client_id",
    /* references: {
      model: CLIENT_TABLE,
      key: "id",
    }, */
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "seller_id",
    /* references: {
      model: SELLER_TABLE,
      key: "id",
    }, */
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "branch_id",
    /* references: {
      model: BRANCH_TABLE,
      key: "id",
    }, */
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "created_at",
  },
  total: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
};

class Order extends Model {
  static associate(models) {
    //this.belongsTo(models.Client, { as: "client" });
    this.belongsTo(models.Seller, { as: "seller" });
    //this.belongsTo(models.Branch, { as: "branch" });
    this.belongsToMany(models.Product, {
      as: "items",
      through: models.OrderProduct,
      foreignKey: "orderId",
      otherKey: "productId",
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_TABLE,
      modelName: "Order",
      timestamps: false,
    };
  }
}

module.exports = {
  ORDER_TABLE,
  OrderSchema,
  Order,
};
