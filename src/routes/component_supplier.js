const router = require("express").Router()
const middlewares = require("../middlewares/authJWT")
const {component_supplier} = require("../controllers")

router.post("/add", middlewares.auth, component_supplier.create)
router.delete("/remove", middlewares.auth, component_supplier.delete)

module.exports = router