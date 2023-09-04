const { models } = require("../libs/sequelize");

const find = () => {
  const clients = models.Client.findAll({
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

const findOne = (id) => {
  const client = models.Client.findByPk(id, {
    include: [
      {
        association: "branches",
        include: ["seller"],
      },
    ],
  });

  if (!client) throw Error("No se encontro el cliente");

  return client;
};

const create = (body) => {
  const client = models.Client.create(body);

  return client;
};

module.exports = {
  find,
  findOne,
  create,
};
