const { Model, DataTypes, Sequelize } = require("sequelize");

const FAMILIA_TABLE = "familia"

const FamiliaSchema = {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
}

class Familia extends Model {
  static associate(models) {
    //
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: FAMILIA_TABLE,
      modelName: 'Familia',
      timestamps: false
    }
  }
}

module.exports = {
  FAMILIA_TABLE,
  FamiliaSchema,
  Familia
}