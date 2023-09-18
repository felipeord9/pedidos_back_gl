const express = require('express')
const passport = require('passport')
const AuthController = require('../../controllers/authController')

const router = express.Router()

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  AuthController.login
)

router.post(
  '/recovery',
  AuthController.recoveryPassword
)

router.post(
  '/change-password',
  AuthController.changePassword
)

module.exports = router