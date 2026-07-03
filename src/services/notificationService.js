const { models } = require('../libs/sequelize')

const find = () => {
  const notificaciones = models.Notification.findAll()

  return notificaciones
}

const findOne = (id) => {
  const notificacion = models.Notification.findByPk(id)

  if(!notificacion) throw new Error('No se encontro la notificacion')

  return notificacion
}

const findByHuella = (hash) => {
  const notification = models.Notification.findOne({
    where: {
        huella: hash
    }
  })

  if(!notification) throw new Error('No se encontro la notificacion')

  return notification
}

const create = async (body) => {
  const newNotification= models.Notification.create(body)
  return newNotification
}

const update = async (id, changes) => {
  const notification = await findOne(id)
  const updatedProduct = notification.update(changes)

  return updatedProduct
}

module.exports = {
  find,
  findOne,
  findByHuella,
  create,
  update,
}