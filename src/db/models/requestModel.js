const { Model, DataTypes, Sequelize } = require("sequelize");
const { USER_TABLE } = require("./userModel")

const REQUEST_TABLE = "request";

const RequestSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  install: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nitClient: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'nit_client'
  },
  nameClient: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'name_client'
  },
  branchClient: {
    type:DataTypes.STRING,
    allowNull: true,
    field: 'branch_client'
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  emisor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  total: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  state:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  reasonForRejection: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "created_at",
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "created_by",
  }
};

class Request extends Model {
  static associate(models) {
    this.belongsToMany(models.Product, {
      as: "items",
      through: models.RequestProduct,
      foreignKey: "requestId",
      otherKey: "productId",
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: REQUEST_TABLE,
      modelName: "Request",
      timestamps: false,
    };
  }
}

module.exports = {
  REQUEST_TABLE,
  RequestSchema,
  Request,
};
