const router = require("express").Router()
const {product_component}  = require("../controllers")
const rbac = require("../middlewares/rbac")
const enums = require("../utils/enums")


router.post("/add", rbac(enums.production, true, true), product_component.add)
router.delete("/remove", rbac(enums.production, true, true), product_component.remove)

module.exports = router