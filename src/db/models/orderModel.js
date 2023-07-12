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
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "client_id",
    references: {
      model: CLIENT_TABLE,
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "seller_id",
    references: {
      model: SELLER_TABLE,
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "branch_id",
    references: {
      model: BRANCH_TABLE,
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "created_at",
  },
  total: {
    type: DataTypes.VIRTUAL,
    get() {
      if (this.items) {
        if (this.items.length > 0) {
          return this.items.reduce((acc, item) => {
            return acc + item.OrderProduct.price * item.OrderProduct.amount;
          });
        }
        return 0;
      }
    },
  },
};

class Order extends Model {
  static associate(models) {
    this.belongsTo(models.Client, { as: "client" });
    this.belongsTo(models.Seller, { as: "seller" });
    this.belongsTo(models.Branch, { as: "branch" });
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