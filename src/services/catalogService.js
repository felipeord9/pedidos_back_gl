const { models } = require('../libs/sequelize')

const find = () => {
  const products = models.CatalogProduct.findAll()

  return products
}

const findOne = (id) => {
  const product = models.CatalogProduct.findByPk(id)

  if(!product) throw new Error('No se encontro el producto')

  return product
}

const create = async (body) => {
  const newProduct = models.CatalogProduct.create(body)
  return newProduct
}

const update = async (changes) => {
  const updatedProduct = models.CatalogProduct.update(changes)
  return updatedProduct
}

const update2 = async (id, changes) => {
  const product = await findOne(id)
  const updatedProduct = product.update(changes)

  return updatedProduct
}

module.exports = {
  find,
  findOne,
  create,
  update,
  update2,
}