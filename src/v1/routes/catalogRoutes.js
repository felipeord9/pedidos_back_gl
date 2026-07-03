const express = require('express')
const CatalogController = require('../../controllers/catalogController')

const router = express.Router()

router
  .get('/', CatalogController.findAllProducts)
  .get('/compare', CatalogController.compareAllProducts)
  .get('/id/:id', CatalogController.findOneProduct)
  .get('/img', CatalogController.updateImg)
  .get('/obtener-archivo/:archivo', CatalogController.verifyImgProduct)
  .post('/', CatalogController.createProduct)
  .post('/create', CatalogController.create2)
  .patch("/", CatalogController.updateProduct)
  .patch("/:id", CatalogController.updateProd2)
  .patch('/update/family', CatalogController.updateFamily)
  
module.exports = router