const express = require('express')
const OrderController = require('../../controllers/orderController')

const router = express.Router()

router
  .get('/', OrderController.findAllOrders)
  .get('/:id', OrderController.findOneOrder)
  .post('/', OrderController.createOrder)
  .post('/add-item', OrderController.addItemOrder)
  .delete('/:id', OrderController.deleteOrder)

module.exports = router