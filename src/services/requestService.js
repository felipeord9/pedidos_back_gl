const { models } = require("../libs/sequelize");

const find=()=>{
    const Requests = models.Request.findAll({
        include: [
            'items'
        ]
    })
    return Requests
};

const findBySeller=(id)=>{
    const Requests = models.Request.findAll({
        where:{
            createdBy:id
        },
        include: [
            'items'
        ]
    })
    return Requests
};

const findByCreater=(name)=>{
    const Requests = models.Request.findAll({
        where:{
            createdBy:name
        },
        include: [
            'items'
        ]
    })
    return Requests
};

const findByEmail=(email)=>{
    const Requests = models.Request.findAll({
        where:{
            destination:email
        },
        include:[
            'items'
        ]
    })
    return Requests
}

const findPRo=()=>{
    const Requests = models.RequestProduct.findAll()
    console.log(JSON.stringify(Requests))
    return Requests
};

const findProducts = (id) =>{
    const productos = models.Request.findAll({
        include: [
            'items'
        ]
    })
    return productos
    /* const Productos = models.RequestProduct.findAll({
        where:{
            requestId:id
        }
    })
    console.log(JSON.stringify(Productos))
    return Productos */
} 

const findRequeById = async (id)=>{
    const Request = await models.Request.findByPk({id,includes:['items']})
  
    return Request
}

const updateItems = async(id,changes)=>{
    const Request = await findRequeById(id)
    const updatedRequest = await Request.update(changes)
    
    return updatedRequest
}


const findOne = async (id) => {
    const Request = await models.Request.findByPk(id)
  
    return Request
}


const create = async (body) => {
    const newRequest = models.Request.create(body)
    return newRequest
}

const update = async (id, changes) => {
    const Request = await findOne(id)
    console.log(changes)
    const updatedRequest = await Request.update(changes)
    
    return updatedRequest
}

const addItem = (body) => {
    const newItem = models.RequestProduct.create(body)
  
    return newItem
}

const findOneItem = async (id) => {
    const Item = await models.RequestProduct.findByPk(id)
  
    return Item
}

const findAllItemsofRequest = async (requestId) => {
    const Items = await models.RequestProduct.findAll({
        where:{
            requestId:requestId
        }
    })
  
    return Items
}

const updateOneItem = async (id, changes) => {
    const Item = await findOneItem(id)
    const updatedItem = await Item.update(changes)
    
    return updatedItem
}

const updateAllItemsofRequest = async (Items,changes) => {
    for (let item of Items){
        await item.update(changes)
    }
    const updateAllItems = await Items.update(changes)

    return updateAllItems
}

module.exports = {
    findOne,
    find,
    findProducts,
    findBySeller,
    findByEmail,
    findByCreater,
    findPRo,
    findRequeById,
    findAllItemsofRequest,
    findOneItem,
    create,
    addItem,
    update,
    updateOneItem,
    updateItems,
    updateAllItemsofRequest,
}