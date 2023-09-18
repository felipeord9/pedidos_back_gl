const boom = require('@hapi/boom')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const UserService = require('./userService')
const { config } = require('../config/config')

const getUser = async (email, password) => {
  const user = await UserService.findByEmail(email)

  if (!user) throw boom.unauthorized()

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) throw boom.unauthorized()

  delete user.dataValues.password
  return user
}

const signToken = (user) => {
  const payload = {
    sub: user.id,
    role: user.role
  }
  const token = jwt.sign(payload, config.jwtSecret)
  return {
    user, token
  }
}

const sendRecovery = async (email) => {
  const user = await UserService.findByEmail(email)

  if (!user) throw boom.unauthorized()

  const payload = { sub: user.id }
  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: '15min'
  })
  const mail = {
    from: config.smtpEmail,
    to: user.email,
    subject: 'Email para recuperar contraseña',
    html: `<b>Ingresa aquí</b>`
  }

  const rta = await sendMail(mail)
  await UserService.update(user.id, { recoveryToken: token })
  return rta
}

const changePassword = async (token, newPassword) => {
  try {
    const payload = jwt.verify(token, config.jwtSecret)
    const user = await UserService.findOne(payload.sub)

    if (user.recoveryToken !== token) throw boom.unauthorized()

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await UserService.update(user.id, {
      password: hashedPassword,
      recoveryToken: null
    })
    return { message: 'Password changed' }
  } catch (error) {
    throw boom.unauthorized()
  }
}

const sendMail = async (infoMail) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: config.smtpEmail,
      pass: config.smtpPassword
    }
  })
  await transporter.sendMail(infoMail)
  return { message: 'Mail sent' }
}

module.exports = {
  getUser,
  signToken,
  sendRecovery,
  changePassword,
  sendMail
}