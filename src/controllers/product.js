const { Product, Component, Product_Component } = require("../db/models");

const getAll = async (req, res, next) => {
  try {
    const products = await Product.findAll({ order: [["id", "ASC"]] });

    res.status(200).json({
      status: true,
      message: "success get all product",
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

const getDetail = async (req, res, next) => {
  try {
    const { product_id } = req.params;

    if (!product_id) {
      throw new Error("missing paramater");
    }

    const product = await Product.findOne({ where: { id: product_id } });
    if (!product) {
      throw new Error("product not found");
    }

    const productComponent = await Product.findByPk(product_id, {
      include: {
        model: Component,
        as: "components",
        through: {
          attributes: [],
        },
      },
      order: [[{model: Component, as: "components"}, "id", "ASC"]]
    });

    return res.status(200).json({
      status: true,
      message: "success get detail product",
      data: productComponent
    });
  } catch (err) {
    if (err.message == "missing paramater" || err.message == "product not found") {
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
    const { name, quantity, component_id } = req.body;

    if (!name || !quantity || !component_id) {
      throw new Error("missing body request");
    }

    if (typeof component_id != "object") {
      throw new Error("component id must be an array");
    }

    const checkComponent = await Component.findAndCountAll({ where: { id: component_id } });

    if (checkComponent.count != component_id.length) {
      throw new Error("there's id not found");
    }

    const newProduct = await Product.create({ name, quantity });
    const product_id = newProduct.id;

    const data = component_id.map((id) => {
      return { product_id: product_id, component_id: id };
    });

    await Product_Component.bulkCreate(data);

    return res.status(201).json({
      status: true,
      message: `success create new product and create records in table product_components`,
      data: newProduct,
    });
  } catch (err) {
    if (err.message == "missing body request" || err.message == "component id must be an array" || err.message == "there's id not found") {
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
    const { product_id } = req.params;
    const { name, quantity } = req.body;

    if (!product_id) {
      throw new Error("missing product id");
    }

    if (!name && !quantity) {
      throw new Error("request body is empty");
    }

    const checkProduct = await Product.findOne({ where: { id: product_id } });
    if (!checkProduct) {
      throw new Error("product not found");
    }

    await Product.update(
      {
        name: name,
        quantity: quantity,
      },
      { where: { id: product_id } }
    );

    return res.status(200).json({
      status: true,
      message: `success updated product id ${product_id}`,
      data: null,
    });
  } catch (err) {
    if (err.message == "missing product id" || err.message == "request body is empty" || err.message == "product not found") {
      return res.status(400).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { product_id } = req.query;

    if (!product_id) {
      throw new Error("missing product_id param");
    }

    const checkProduct = await Product.findOne({ where: { id: product_id } });
    if (!checkProduct) {
      throw new Error("product not found");
    }

    await Product.destroy({ where: { id: product_id } });

    return res.status(200).json({
      status: true,
      message: `success delete product id ${product_id}`,
      data: null,
    });
  } catch (err) {
    if (err.message == "missing product_id param" || err.message == "product not found") {
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
  delete: deleteProduct,
};
