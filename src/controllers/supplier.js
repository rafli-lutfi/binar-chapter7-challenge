const { Supplier, Component, Component_Supplier } = require("../db/models");

const getAll = async (req, res, next) => {
  try {
    const suppliers = await Supplier.findAll({
      order: [["id", "ASC"]],
    });

    return res.status(200).json({
      status: true,
      message: "success get all suppliers",
      data: suppliers,
    });
  } catch (err) {
    next(err);
  }
};

const getDetail = async (req, res, next) => {
  try {
    const { supplier_id } = req.params;

    if (!supplier_id) {
      throw new Error("missing query param");
    }

    const supplier = await Supplier.findOne({ where: { id: supplier_id } });

    if (!supplier) {
      throw new Error("supplier not found");
    }

    const supplierComponents = await Supplier.findByPk(supplier_id,{
      include: {
        model: Component,
        as: "components",
        through: {
          attributes: [], 
        },
      },
      order: [[{model: Component, as: "components"}, "id", "ASC"]]
    });

    res.status(200).json({
      status: true,
      message: "success get detail suppliers",
      data: supplierComponents,
    });
  } catch (err) {
    if (err.message == "missing query param" || err.message == "supplier not found") {
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
    const { name, address, component_id } = req.body;

    if (!name || !address) {
      throw new Error("missing data request body");
    }

    // component id is an optional input, and it will be validated if included in request body
    if (component_id) {
      if (typeof component_id != "object") {
        throw new Error("component id must be an array");
      }

      const checkComponent = await Component.findAndCountAll({ where: { id: component_id } });

      if (checkComponent.count != component_id.length) {
        throw new Error("there's id not found");
      }
    }

    const newSupplier = await Supplier.create({ name: name, address: address });

    const supplier_id = newSupplier.id;

    let addMessage = "";
    if (component_id) {
      const data = component_id.map((id) => {
        return { component_id: id, supplier_id: supplier_id };
      });

      await Component_Supplier.bulkCreate(data);

      addMessage += " and create records in table component_suppliers";
    }

    return res.status(201).json({
      status: true,
      message: `success create new supplier${addMessage}`,
      data: newSupplier,
    });
  } catch (err) {
    if (err.message == "missing data request body" || err.message == "component id must be an array" || err.message == "component id not found") {
      // handle Bad Request 400
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
    const { supplier_id } = req.params;
    const { name, address } = req.body;

    if (!supplier_id) {
      throw new Error("missing supplier id");
    }

    if (!name && !address) {
      throw new Error("missing data body request");
    }

    const checkSupplier = await Supplier.findOne({ where: { id: supplier_id } });
    if (!checkSupplier) {
      throw new Error("supplier not found");
    }

    await Supplier.update({ name: name, address: address }, { where: { id: supplier_id } });

    return res.status(200).json({
      status: true,
      message: `success update supplier id ${supplier_id}`,
      data: null,
    });
  } catch (err) {
    if (err.message == "missing supplier id" || err.message == "missing data body request" || err.message == "supplier not found") {
      return res.status(400).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
    next(err);
  }
};

const deleteSupllier = async (req, res, next) => {
  try {
    const { supplier_id } = req.query;

    if (!supplier_id) {
      throw new Error("missing supplier id query");
    }

    const checkSupplier = await Supplier.findOne({ where: { id: supplier_id } });
    if (!checkSupplier) {
      throw new Error("supplier not found");
    }

    Supplier.destroy({ where: { id: supplier_id } });

    return res.status(200).json({
      status: true,
      message: `success deleted supplier id ${supplier_id}`,
      data: null,
    });
  } catch (err) {
    if (err.message == "missing supplier id query" || err.message == "supplier not found") {
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
  delete: deleteSupllier,
};
