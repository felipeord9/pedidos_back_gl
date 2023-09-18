const { Model, DataTypes, Sequelize } = require("sequelize");

const USER_TABLE = "clients";

const UserSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rowId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'row_id'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  recoveryToken: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'recovery_token'
  },
  role: {
    type: DataTypes.ENUM(["seller", "agency", "admin"]),
    allowNull: false,
    defaultValue: 'seller'
  },
  positionCompany: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'position_company'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  }
};

class User extends Model {
  static associate(models) {
    //
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
      timestamps: false
    }
  }
}

module.exports = {
  USER_TABLE,
  UserSchema,
  User
}