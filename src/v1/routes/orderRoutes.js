const express = require('express')
const passport = require('passport')
const OrderController = require('../../controllers/orderController')
const { checkRoles } = require('../../middlewares/authHandler')

const router = express.Router()

router
  /* Rutas para obtener registros como administrador */
  .get(
    '/', 
    passport.authenticate('jwt', { session: false }), 
    checkRoles('admin'), 
    OrderController.findAllOrders
  )
  .get(
    '/initial/', 
    passport.authenticate('jwt', { session: false }), 
    checkRoles('admin'), 
    OrderController.findInitialOrders
  )

  /* Rutas para obtener registros como vendedor */
  .get(
    '/seller/:sellerId', 
    passport.authenticate('jwt', { session: false }), 
    checkRoles('vendedor'), 
    OrderController.findAllOrdersBySeller
  )
  .get(
    '/seller/initial/:sellerId', 
    passport.authenticate('jwt', { session: false }), 
    checkRoles('vendedor'), 
    OrderController.findInitialOrdersBySeller
  )

  /* Rutas para obtener registros como agencia */
  .get(
    '/co/:coId', 
    passport.authenticate('jwt', { session: false }), 
    checkRoles('agencia'), 
    OrderController.findAllOrdersByCO
  )
  .get(
    '/co/initial/:coId', 
    passport.authenticate('jwt', { session: false }), 
    checkRoles('agencia'), 
    OrderController.findInitialOrdersByCO
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