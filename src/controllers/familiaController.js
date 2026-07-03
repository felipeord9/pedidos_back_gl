const FamiliaService = require("../services/familiaService");

const findAllFamilias = async (req, res, next) => {
  try {
    const data = await FamiliaService.find();
    res.status(200).json({
      status: "OK",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const findOneFamilia = async (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;
    const data = await FamiliaService.findOne(id);

    res.status(200).json({
      status: "OK",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const createFamilia = async (req, res, next) => {
  try {
    const { body } = req
    console.log(body)
    
    const data = FamiliaService.create(body)

    res.status(201).json({
      message: 'Created',
      data
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const updateFamilia = async (req, res, next) => {
  try {
    const { body } = req
    console.log(body)

    const family = await findOneFamilia(body.id)
    const data = FamiliaService.update(body)

    res.status(201).json({
      message: 'Updated',
      data
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

module.exports = {
  findAllFamilias,
  findOneFamilia,
  createFamilia,
  updateFamilia,
};
