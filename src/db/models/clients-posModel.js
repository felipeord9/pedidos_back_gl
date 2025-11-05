const { Model, DataTypes, Sequelize } = require("sequelize");

const CLIENT_POS_TABLE = "clients_pos";

const ClientPosSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  razonSocial: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'description'
  },
  telefono: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'telephone'
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'direction'
  },
  fotoLocal:{
    type: DataTypes.BOOLEAN,
    allowNull: true,
    field: "photo_local",
  },
  plazo:{
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "term_credit",
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
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "updated_at",
  },
  updatedBy: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "updated_by",
  },
  idCreator: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "id_creator",
  },
  idUpdater: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "id_updater",
  },
};

class ClientPos extends Model {
  static associate(models) {
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CLIENT_POS_TABLE,
      modelName: 'ClientPos',
      timestamps: false
    }
  }
}

module.exports = {
  CLIENT_POS_TABLE,
  ClientPosSchema,
  ClientPos
}