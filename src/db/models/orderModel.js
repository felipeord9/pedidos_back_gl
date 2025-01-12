const { Model, DataTypes, Sequelize } = require("sequelize");
const { CLIENT_TABLE } = require("./clientModel");
const { SELLER_TABLE } = require("./sellerModel");
const { BRANCH_TABLE } = require("./branchModel");
const { USER_TABLE } = require("./userModel")

const ORDER_TABLE = "orders";

const OrderSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rowId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'row_id'
  },
  deliveryDate: {
    type: DataTypes.DATE,
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
  state: {
    type: DataTypes.ENUM(["pedido nuevo", "alistamiento", "verificando pago", "en ruta", "rechazado", "entregado"]),
    allowNull: false,
    defaultValue: 'pedido nuevo'
  },
  reasonForRejection: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'reason_for_rejection'
  },
  reasonForDelivery: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'reason_for_delivery'
  },
  coId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'co_id'
  },
  coDescription: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'co_description'
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
  clientDescription: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'client_description'
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
  sellerDescription: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'seller_description'
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
  branchDescription: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "branch_description"
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: USER_TABLE,
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
};

class Order extends Model {
  static associate(models) {
    //this.belongsTo(models.Client, { as: "client" });
    //this.belongsTo(models.Seller, { as: "seller" });
    //this.belongsTo(models.Branch, { as: "branch" });
    this.belongsTo(models.User, { as: 'user'})
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
