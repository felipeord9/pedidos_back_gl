const { models } = require("../libs/sequelize");

const find = () => {
  const orders = models.Order.findAll({
    include: [
      "items"
    ],
  });

  return orders
};

const finOne = (id) => {
  const order = models.Order.findByPk(id)

  if(!order) throw Error('No se encontró la orden')

  return order
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
  await order.destroy(id)
  return id
}

module.exports = {
  find,
  finOne,
  create,
  addItem,
  remove
}