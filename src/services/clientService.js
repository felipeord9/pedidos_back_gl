const boom = require('@hapi/boom')
const { models } = require("../libs/sequelize");

const find = async () => {
  const clients = await models.Client.findAll({
    include: [
      {
        association: "sucursales",
        attributes: [["id", "idUn"], ["branch", "id"], "descripcion"],
        include: ["vendedor"],
      },
    ],
  });
  return clients;
};

const findOne = async (id) => {
  const client = await models.Client.findByPk(id, {
    include: [
      {
        association: "branches",
        include: ["seller"],
      },
    ],
  });

  if (!client) throw boom.notFound("Client not found");

  return client;
};

const create = async (body) => {
  const client = await models.Client.create(body);

  return client;
};

module.exports = {
  find,
  findOne,
  create,
};
