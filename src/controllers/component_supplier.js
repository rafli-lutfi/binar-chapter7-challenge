const { Supplier, Component, Component_Supplier } = require("../db/models");

const create = async (req, res, next) => {
  try {
    const { supplier_id } = req.query;
    const { component_id } = req.body;

    if (!supplier_id) {
      throw new Error("missing query parameter");
    }

    if (!component_id){
      throw new Error("missing body request")
    }

    if (typeof component_id != "object") {
      throw new Error("component id must be an array");
    }

    const checkComponent = await Component.findAndCountAll({ where: { id: component_id } });

    if (checkComponent.count != component_id.length) {
      throw new Error("there's component id that can't be found");
    }

    const checkSupplier = await Supplier.findOne({ where: { id: supplier_id } });
    if (!checkSupplier) {
      throw new Error("supplier not found");
    }

    const checkComponentSupplier = await Component_Supplier.findAndCountAll({ where: { component_id: component_id, supplier_id: supplier_id } });

    if (checkComponentSupplier.count == component_id.length) {
      throw new Error("there is some data that already exist");
    }

    const data = component_id.map((id) => {
      return { component_id: id, supplier_id: supplier_id };
    });

    await Component_Supplier.bulkCreate(data);

    return res.status(201).json({
      status: true,
      message: "success create record/records in table component_supplier",
      data: null,
    });
  } catch (err) {
    if (err.message == "missing query parameter" || err.message == "missing body request" || err.message == "component id must be an array" || err.message == "there's component id that can't be found" || err.message == "supplier not found" || err.message == "there is some data that already exist") {
      return res.status(400).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
    next(err);
  }
};

const deleteComponentSupplier = async (req, res, next) => {
  try {
    const { supplier_id, component_id } = req.query;

    if (!supplier_id || !component_id) {
      throw new Error("missing id in parameter or query");
    }

    const checkSupplier = await Supplier.findOne({ where: { id: supplier_id } });
    if (!checkSupplier) {
      throw new Error("supplier not found");
    }

    const checkComponent = await Component.findOne({ where: { id: component_id } });
    if (!checkComponent) {
      throw new Error("component not found");
    }

    const checkComponentSupplier = await Component_Supplier.findOne({ where: { supplier_id: supplier_id, component_id: component_id } });
    if (!checkComponentSupplier) {
      throw new Error("record not found");
    }

    await Component_Supplier.destroy({ where: { component_id: component_id, supplier_id: supplier_id } });

    return res.status(200).json({
      status: true,
      message: "success delete records in table component_supplier",
      data: null,
    });
  } catch (err) {
    if (err.message == "missing id in parameter or query" || err.message == "supplier not found" || err.message == "component not found" || err.message == "record not found") {
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
  create,
  delete: deleteComponentSupplier,
};
