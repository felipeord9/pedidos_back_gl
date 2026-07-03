const express = require('express')
const FamiliaController = require('../../controllers/familiaController')

const router = express.Router()

router
  .get('/', FamiliaController.findAllFamilias)
  .get('/:id', FamiliaController.findOneFamilia)
  .post('/', FamiliaController.createFamilia)
  .patch("/", FamiliaController.updateFamilia)
module.exports = router