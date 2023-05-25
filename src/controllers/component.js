const { Component, Supplier, Component_Supplier } = require("../db/models");

const getAll = async (req, res, next) => {
  try {
    const components = await Component.findAll({ order: [["id", "ASC"]] });

    res.status(200).json({
      status: true,
      message: "success get all component",
      data: components,
    });
  } catch (err) {
    next(err);
  }
};

const getDetail = async (req, res, next) => {
  try {
    const { component_id } = req.params;
    if (!component_id) {
      throw new Error("missing parameter");
    }

    const component = await Component.findOne({ where: { id: component_id } });
    if (!component) {
      throw new Error("component not found");
    }

    const componentSuppliers = await Component.findByPk(component_id, {
      include: [
        {
          model: Supplier,
          as: "suppliers",
          through: {
            attributes: [],
          },
        },
      ],
    });

    return res.status(200).json({
      status: true,
      message: "success get detail component",
      data: componentSuppliers,
    });
  } catch (err) {
    if (err.message == "missing parameter" || err.message == "component not found") {
      return res.status(400).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, description, supplier_id } = req.body;

    if (!name || !description) {
      throw new Error("missing data request body");
    }

    if (supplier_id) {
      if (typeof supplier_id != "object") {
        throw new Error("supllier id must be an array");
      }

      const checkSupplier = await Supplier.findAndCountAll({ where: { id: supplier_id } });

      if (checkSupplier.count != supplier_id.length) {
        throw new Error("there's supplier id not found");
      }
    }

    const newComponent = await Component.create({ name: name, description: description });
    const component_id = newComponent.id;

    let addMessage = "";
    if (supplier_id) {
      const data = supplier_id.map((id) => {
        return { component_id: component_id, supplier_id: id };
      });

      await Component_Supplier.bulkCreate(data);

      addMessage += " and create new record in table component_suppliers";
    }

    return res.status(201).json({
      status: true,
      message: `Success create new component${addMessage}`,
      data: newComponent,
    });
  } catch (err) {
    if (err.message == "missing data request body" || err.message == "supllier id must be an array" || err.message == "there's supplier id not found") {
      return res.status(400).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { component_id } = req.params;
    const { name, description } = req.body;

    if (!component_id) {
      throw new Error("missing parameter");
    }

    console.log(name, description);
    if (!name && !description) {
      throw new Error("request body is empty");
    }

    const checkComponent = await Component.findOne({ where: { id: component_id } });
    if (!checkComponent) {
      throw new Error("component not found");
    }

    await Component.update(
      {
        name: name,
        description: description,
      },
      { where: { id: component_id } }
    );

    return res.status(200).json({
      status: true,
      message: `success update component`,
      data: null,
    });
  } catch (err) {
    if (err.message == "missing parameter" || err.message == "request body is empty" || err.message == "component not found") {
      return res.status(400).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
    next(err);
  }
};

const deleteComponent = async (req, res, next) => {
  try {
    const { component_id } = req.query;

    if (!component_id) {
      throw new Error("missing query paramater");
    }

    const checkComponent = await Component.findOne({ where: { id: component_id } });
    if (!checkComponent) {
      throw new Error("component not found");
    }

    await Component.destroy({ where: { id: component_id } });

    return res.status(200).json({
      status: true,
      message: `success delete component`,
      data: null,
    });
  } catch (err) {
    if (err.message == "missing query paramater" || err.message == "component not found") {
      return res.status(400).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
    next(err);
  }
};

module.exports = {
  getAll,
  getDetail,
  create,
  update,
  delete: deleteComponent,
};
