const { models } = require('../libs/sequelize')

const find = () => {
  const familias = models.Familia.findAll()

  return familias
}

const findOne = (id) => {
  const familia = models.Familia.findByPk(id)

  if(!familia) throw new Error('No se encontro la familia')

  return familia
}

const create = async (body) => {
  const newFamilia = models.Familia.create(body)
  return newFamilia
}

const update = async (changes) => {
  const updatedFamilia = models.Familia.update(changes)
  return updatedFamilia
}

module.exports = {
  find,
  findOne,
  create,
  update
}