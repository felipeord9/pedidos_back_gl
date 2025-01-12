const express = require('express')
const passport = require('passport')
const OrderController = require('../../controllers/orderController')
const { checkRoles } = require('../../middlewares/authHandler')

const router = express.Router()

router
  .get(
    '/', 
    passport.authenticate('jwt', { session: false }), 
    checkRoles('admin'), 
    OrderController.findAllOrders
  )
  .get(
    '/seller/:sellerId', 
    passport.authenticate('jwt', { session: false }), 
    checkRoles('vendedor'), 
    OrderController.findAllOrdersBySeller
  )
  .get(
    '/co/:coId', 
    passport.authenticate('jwt', { session: false }), 
    checkRoles('agencia'), 
    OrderController.findAllOrdersByCO
  )
  .get(
    '/:id', 
    passport.authenticate('jwt', { session: false }), 
    checkRoles('admin'), 
    OrderController.findOneOrder
  )
  .post(
    '/', 
    passport.authenticate('jwt', { session: false }), 
    checkRoles('admin', "vendedor", "agencia"), 
    OrderController.createOrder
  )
  .patch(
    "/:id",
    passport.authenticate('jwt', { session: false }),
    checkRoles('admin', 'agencia'),
    OrderController.updateOrder
  )
  .post(
    '/add-item', 
    OrderController.addItemOrder
  )
  .delete(
    '/:id', 
    passport.authenticate('jwt', { session: false }), 
    checkRoles('admin'), 
    OrderController.deleteOrder
  )

module.exports = router