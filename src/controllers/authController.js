const AuthService = require('../services/authService')

const login = async (req, res, next) => {
  try {
    const user = req.user
    delete user.dataValues.recoveryToken
    res.status(200).json(AuthService.signToken(user))
  } catch (error) {
    next(error)
  }
}

const recoveryPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    const data = await AuthService.sendRecovery(email)
    res.status(200).json(data)
  } catch (error) {
    next(error)
  }
}

const changePassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body
    const data = await AuthService.changePassword(token, newPassword)
    res.status(200).json(data)
  } catch (error) {

  }
}

module.exports = {
  login,
  recoveryPassword,
  changePassword
}