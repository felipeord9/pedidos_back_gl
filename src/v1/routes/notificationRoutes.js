const express = require('express')
const NotificationController = require('../../controllers/notificationController')

const router = express.Router()

router
  .patch("/:id", NotificationController.updateNotification)
  
module.exports = router