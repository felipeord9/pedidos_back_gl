const express = require('express')
const RequestController = require('../../controllers/requestController')

const router = express.Router()

router
    .get('/',RequestController.findAllRequest)
    .get('/products',RequestController.findAllpro)
    .get('/:id',RequestController.findOneRequest)
    .get('/prdocuts/:id',RequestController.findAllProductsByRequest)
    /* .get('/seller/:id',RequestController.findAllRequestBySeller) */
    .get('/seller/:name',RequestController.findAllRequestByCreater)
    .get('/aprobador/:email', RequestController.findAllRequestByEmail)
    .post('/',RequestController.createRequest)
    .post("/send", RequestController.sendMail)
    .post("/send/answer",RequestController.sendAnswer)

    .post("/send/confirm",RequestController.sendConfirm)
    .post("/send/rechazo",RequestController.sendRechazo)

    .patch('/update/request/:id', RequestController.updateRequest)
    .patch("/update/item/:id", RequestController.updateItem)
    .patch("/update/all/items/:id", RequestController.updateItemsofRequest)

module.exports = router