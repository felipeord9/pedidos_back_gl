const OrderService = require('../services/orderService')

const findAllOrders = async (req, res, next) => {
  try {
    let data
    if(Object.keys(req.query).length > 0) {
      const { init, final } = req.query
      const newFinal = new Date(final)
      newFinal.setDate(newFinal.getDate() + 1)
      data = await OrderService.findFilteredByDate(init, newFinal)
    } else {
      data = await OrderService.find()
    }

    res.status(200).json({
      message: 'OK',
      data 
    })
  } catch (error) {
    next(error)
  }
}

const findAllOrdersBySeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params
    const data = await OrderService.findBySeller(sellerId)

    res.status(200).json({
      message: 'OK',
      data 
    })
  } catch (error) {
    next(error)
  }
}

const findAllOrdersByCO = async (req, res, next) => {
  try {
    const { coId } = req.params
    const data = await OrderService.findByCO(coId)

    res.status(200).json({
      message: 'OK',
      data 
    })
  } catch (error) {
    next(error)
  }
}

const findOneOrder = async (req, res, next) => {
  try {
    const { params: { id }} = req
    const data = await OrderService.finOne(id)

    res.status(200).json({
      message: 'OK',
      data
    })
  } catch (error) {
    next(error)
  }
}

const findFilteredOrdersByDate = async (req, res, next) => {
  try {
    const { query: { init, final }} = req
    const data = await OrderService.findFilteredByDate(init, final)

    res.status(200).json({
      message: 'OK',
      data
    })
  } catch (error) {
    
  }
}

const createOrder = async (req, res, next) => {
  try {
    const { body } = req
    console.log(body)
    const data = await OrderService.create({
      deliveryDate: body.deliveryDate,
      observations: body.observations,
      purchaseOrder: body.purchaseOrder,
      clientId: parseInt(body.client.nit),
      clientDescription: body.client.razonSocial,
      sellerId: body.seller.id,
      sellerDescription: body.seller.tercero ? body.seller.tercero.razonSocial : body.seller.description,
      branchId: body.branch.id,
      branchDescription: body.branch.descripcion,
      coId: body.agency.id,
      coDescription: body.agency.descripcion,
      createdAt: body.createdAt,
      total: parseInt(body.products.total.split('.').join(''))
    })
    
    for(let product of body.products.agregados) {
      await OrderService.addItem({
        amount: Number(product.amount),
        price: Number(product.price.split('.').join('')),
        orderId: data.id,
        productId: product.id
      })
    }

    res.status(201).json({
      message: 'Created',
      data
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const addItemOrder = async (req, res, next) => {
  try {
    const { body } = req
    const data = await OrderService.addItem(body)

    res.status(201).json({
      message: 'Created',
      data
    })
  } catch (error) {
    next(error)
  }
}

const deleteOrder = async (req, res, next) => {
  try {
    const { params: { id } } = req
    const data = await OrderService.remove(id)

    res.status(202).json({
      message: 'Deleted',
      data
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  findAllOrders,
  findAllOrdersBySeller,
  findAllOrdersByCO,
  findOneOrder,
  findFilteredOrdersByDate,
  createOrder,
  addItemOrder,
  deleteOrder
}