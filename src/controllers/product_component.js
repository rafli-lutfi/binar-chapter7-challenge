const { Product, Component, Product_Component } = require("../db/models");

module.exports = {
  add: async (req, res, next) => {
    try {
      const { product_id } = req.query;
      const { component_id } = req.body;

      if (!product_id) throw new Error("missing query parameter");

      if (!component_id) throw new Error("missing body request")

      if (typeof component_id != "object") throw new Error("component_id must be an array");

      const checkComponent = await Component.findAndCountAll({ where: { id: component_id } });

      if (checkComponent.count != component_id.length) throw new Error("there's is some id that cant be found");

      const checkProduct = await Product.findOne({ where: { id: product_id } });

      if (!checkProduct) throw new Error("product not found");

      const data = component_id.map((id) => {
        return { product_id: product_id, component_id: id };
      });

      const checkProductComponent = await Product_Component.findAndCountAll({ where: data });

      if (checkProductComponent.count == product_id.length) throw new Error("there's some data that already exist");

      await Product_Component.bulkCreate(data);

      res.status(201).json({
        status: true,
        message: "success create records in table product_components",
        data: null,
      });
    } catch (err) {
      if (
        err.message == "missing query parameter" ||
        err.message == "missing body request" ||
        err.message == "component_id must be an array" ||
        err.message == "there's is some id that cant be found" ||
        err.message == "product not found" ||
        err.message == "there's some data that already exist"
      ) {
        return res.status(400).json({
          status: false,
          message: err.message,
          data: null,
        });
      }
      next(err);
    }
  },
  remove: async (req, res, next) => {
    try {
      const {product_id, component_id} = req.query

      if(!product_id || !component_id) throw new Error("missing query parameter")

      const checkProduct = await Product.findOne({ where: { id: product_id } });

      if (!checkProduct) throw new Error("product not found");

      const checkComponent = await Component.findOne({ where: { id: component_id } });

      if (!checkComponent) throw new Error("component not found")

      const deletedItems = await Product_Component.destroy({where:{product_id:product_id ,component_id: component_id}})
      console.log(deletedItems);
      if(!deletedItems) throw new Error("record not found")

      return res.status(200).json({
        status: true,
        message: "success deleted record in table product_components",
        data: null
      })
    } catch (err) {
      if(err.message == "missing query parameter" || err.message == "product not found" || err.message == "component not found" || err.message == "record not found"){
        return res.status(400).json({
          status: false,
          message: err.message,
          data: null
        })
      }
      next(err)
    }
  },
};
