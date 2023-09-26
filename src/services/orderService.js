const { Op } = require("sequelize");
const { models } = require("../libs/sequelize");

const find = () => {
  const orders = models.Order.findAll({
    include: [
      "items",
      "user"
    ],
    order: [["id", "DESC"]]
  });

  return orders
};

const findBySeller = (sellerId) => {
  const orders = models.Order.findAll({
    where: {
      sellerId
    },
    include: [
      "items",
      "user"
    ],
    order: [["id", "DESC"]]
  });

  return orders
};

const findByCO = (coId) => {
  const orders = models.Order.findAll({
    where: {
      coId
    },
    include: [
      "items",
      "user"
    ],
    order: [["id", "DESC"]]
  });

  return orders
};

const finOne = (id) => {
  const order = models.Order.findByPk(id)

  if(!order) throw Error('No se encontró la orden')

  return order
}

const findFilteredByDate = (initialDate, finalDate) => {
  const orders = models.Order.findAll({
    where: {
      [Op.and]: [
        {
          createdAt: { [Op.gte] : initialDate}
        },
        {
          createdAt : { [Op.lte]: finalDate}
        }
      ]
    },
    include: [
      "items"
    ],
    order: [["id", "DESC"]]
  });

  if(!orders) throw Error('No hay pedidos en ese rango de fechas')

  return orders
}

const addItem = (body) => {
  const newItem = models.OrderProduct.create(body)

  return newItem
}

const create = async (body) => {
  const newOrder = models.Order.create(body)
  return newOrder
}

const remove = async (id) => {
  const order = await finOne(id)
  models.Order.beforeDestroy(async (order) => {
    await models.OrderProduct.destroy({ where: { orderId: order.id } })
  })
  models.Order.sequelize.query(`ALTER SEQUENCE orders_id_seq RESTART WITH ${id};`)
  models.Order.sequelize.query(`ALTER SEQUENCE co_${order.coId}_seq RESTART WITH ${order.rowId};`)
  await order.destroy(id)
  return id
}

module.exports = {
  find,
  findBySeller,
  findByCO,
  finOne,
  findFilteredByDate,
  create,
  addItem,
  remove
}