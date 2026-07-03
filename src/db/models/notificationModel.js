const { Model, DataTypes, Sequelize } = require("sequelize");

const NOTIFICATION_TABLE = "notification"

const NotificationSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  producId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "product_id",
  },
  concept: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipoNotificacion:{
    type: DataTypes.STRING,
    allowNull: false,
    field: "notication_type",
  },
  fechaNotificacion: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "notication_date",
  },
  huella: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  leido: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
}

class Notification extends Model {
  static associate(models) {
    //
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: NOTIFICATION_TABLE,
      modelName: 'Notification',
      timestamps: false
    }
  }
}

module.exports = {
  NOTIFICATION_TABLE,
  NotificationSchema,
  Notification
}