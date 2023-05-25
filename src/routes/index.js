const router = require("express").Router();
const swaggerUI = require("swagger-ui-express")
const swaggerDocument = require("../swagger.json")

const user = require("./user")

const component = require("./component")
const supplier = require("./supplier")
const componentSupplier = require("./component_supplier")

const product = require("./product")
const product_component = require("./product_component")

router.use("/docs", swaggerUI.serve)
router.get("/docs", swaggerUI.setup(swaggerDocument))

router.use(user)

router.use("/components", component)
router.use("/suppliers", supplier)
router.use("/componentSuppliers", componentSupplier)

router.use("/products", product)
router.use("/productComponents", product_component)

module.exports = router
