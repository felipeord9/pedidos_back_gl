const { models } = require('../libs/sequelize')
const sellerService = require('../services/sellerService')

const find = () => {
  const clients = models.ClientPos.findAll({
    order: [["id", "DESC"]]
  })
  return clients
}

const findByCo = (id) => {
  const client = models.ClientPos.findAll({
    where: {
      coId : id
    },
    order: [["id", "DESC"]]
  })

  if(!client) throw Error("No se encontro el cliente")

  return client
}

const findBySeller = async (id) => {
  console.log(`entrada: ${id}`)

  const look = parseInt(id)
  const coBySeller = await sellerService.findOne(look)

  // Verificar si se encontró el vendedor
  if (!coBySeller) {
    console.log("Vendedor no encontrado")
    throw new Error("Vendedor no encontrado");
  }

  console.log('co del vendedor:',JSON.stringify(coBySeller))
  const co = coBySeller.co
  console.log(JSON.stringify(co))

  const client = models.ClientPos.findAll({
    where: {
      coId : co
    },
    order: [["id", "DESC"]]
  })

  if(!client) throw Error("No se encontro el cliente")

  return client
}

const findOne = (id) => {
  const client = models.ClientPos.findByPk(id)

  if(!client) throw Error("No se encontro el cliente")

  return client
}

const findByName = async (coid, name) => {
  const client = await models.ClientPos.findOne({
    where: {
      razonSocial: name,
      coId: coid
    }
  })

  /* if(!client) throw Error("No se encontro el cliente") */

  return client
}

const create = async (data) => {

  const look = await findByName(data.coId, data.razonSocial)

  if(look) throw Error("El cliente ya existe")

  const newClient = models.ClientPos.create(data)

  return newClient

}

const addItem = (body) => {
  const newItem = models.ClientPos.create(body)

  return newItem
}

const update = async (id, changes) => {
  const client = await findOne(id)

  const updatedClient = client.update(changes)

  return updatedClient
}

module.exports = {
  find,
  findOne,
  findByCo,
  findBySeller,
  findByName,
  create, 
  addItem,
  update
}