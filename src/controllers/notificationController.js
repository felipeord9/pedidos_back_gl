const NotificationService = require('../services/notificationService')
const { config } = require('../config/config')

const updateNotification= async (req, res, next) => {
  try {
    const { body, params: { id }} = req
    const data = await NotificationService.update(id, body)

    res.status(200).json({
      message: "Updated",
      data
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  updateNotification,
};