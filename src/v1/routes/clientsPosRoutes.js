const express = require('express')
const passport = require('passport')
const clientsPosController = require('../../controllers/clientsPosController')
const { checkRoles } = require('../../middlewares/authHandler')

const router = express.Router()

router.use(
  passport.authenticate('jwt', { session: false })
)

router
  .get('/', clientsPosController.findAllClients)
  .get('/:id', clientsPosController.findOneClient)
  .get('/agency/:id', clientsPosController.findAllClientsByCo)
  .get('/seller/:id', clientsPosController.findAllClientsBySeller)
  .get('/client/:coid/:name', clientsPosController.findOneClientByName)
  .post('/', checkRoles('admin', "vendedor", "agencia", "aprobador"), clientsPosController.createClient)
  .patch('/:id', checkRoles('admin', "vendedor", "agencia", "aprobador"), clientsPosController.updateClient)

module.exports = router