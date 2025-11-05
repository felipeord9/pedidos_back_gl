const clientsPosService = require('../services/clientsPosService')

const findAllClients = async (req, res, next) => {
  try {
    const data = await clientsPosService.find()

    res.status(200).json({
      message: 'OK',
      data
    })
  } catch (error) {
    next(error)
  }
}

const findAllClientsBySeller = async (req, res, next) => {
  try {
    const { params: { id }} = req
    const data = await clientsPosService.findBySeller(id)

    res.status(200).json({
      message: 'OK',
      data
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const findAllClientsByCo = async (req, res, next) => {
  try {
    const { params: { id }} = req
    const data = await clientsPosService.findByCo(id)

    res.status(200).json({
      message: 'OK',
      data
    })
  } catch (error) {
    next(error)
  }
}

const findOneClient = async (req, res, next) => {
  try {
    const { params: { id }} = req
    const data = await clientsPosService.findOne(id)

    res.status(200).json({
      message: 'Ok',
      data
    })
  } catch (error) {
    next(error)    
  }
}

const findOneClientByName = async (req, res, next) => {
  try {
    const { params: { coid , name }} = req

    const data = await clientsPosService.findByName(coid, name)

    console.log(data)

    if(data){
      res.status(200).json({
        message: 'Ok',
        data
      })
    }else{
      res.status(500).json({
        message: 'error'
      })
    }

  } catch (error) {
    next(error)    
  }
}

const createClient = async (req, res, next) => {
  try {
    const { body } = req

    const data = await clientsPosService.create(body)

    res.status(201).json({
      message: 'Created',
      data
    })
  } catch (error) {
    console.log(error)
    next(error)    
  }
}

const updateClient = async (req, res, next) => {
  try {
    const { body, params: { id } } = req
    const data = await clientsPosService.update(id, body)

    res.status(200).json({
      message: 'Updated',
      data
    })
  } catch (error) {
    next(error)    
  }
}

module.exports = {
  findAllClients,
  findOneClient,
  findAllClientsByCo,
  findAllClientsBySeller,
  findOneClientByName,
  createClient,
  updateClient
}