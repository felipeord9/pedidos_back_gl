const { Model, DataTypes, Sequelize } = require("sequelize");

const CATALOG_PRODUCT_TABLE = "catalog_product"

const CatalogProductSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  um: {
    type: DataTypes.STRING,
    allowNull: false
  },
  alternateRef: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "alternate_ref",
  },
  family: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  familyDescrip: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "family_descrption",
  },
  imgProduct: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    field: "img_product",
  },
  imgPacking: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    field: "img_packing",
  },
  imgPresentation: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    field: "img_presentation",
  },
  imgBarcode: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    field: "img_barcode",
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true,
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
  }
}

class CatalogProduct extends Model {
  static associate(models) {
    //
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CATALOG_PRODUCT_TABLE,
      modelName: 'CatalogProduct',
      timestamps: false
    }
  }
}

module.exports = {
  CATALOG_PRODUCT_TABLE,
  CatalogProductSchema,
  CatalogProduct
}