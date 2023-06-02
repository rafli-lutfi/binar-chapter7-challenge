const router = require("express").Router();
const swaggerUI = require("swagger-ui-express")
const swaggerDocument = require("../swagger.json")

const jwt = require("../middlewares/authJWT")

const rbac = require("./rbac")
const user = require("./user")

const component = require("./component")
const supplier = require("./supplier")
const componentSupplier = require("./component_supplier")

const product = require("./product")
const product_component = require("./product_component")

router.use("/docs", swaggerUI.serve)
router.get("/docs", swaggerUI.setup(swaggerDocument))

router.use(user)

router.use(jwt.auth, rbac)

router.use("/components", jwt.auth, component)
router.use("/suppliers", jwt.auth, supplier)
router.use("/componentSuppliers", jwt.auth, componentSupplier)

router.use("/products", jwt.auth, product)
router.use("/productComponents", jwt.auth, product_component)

module.exports = router
