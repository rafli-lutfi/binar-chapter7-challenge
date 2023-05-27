const router = require("express").Router()
const rbac = require("../middlewares/rbac")
const enums = require("../utils/enums")
const {component_supplier} = require("../controllers")

router.post("/add", rbac(enums.production, true, true), component_supplier.create)
router.delete("/remove", rbac(enums.production, true, true), component_supplier.delete)

module.exports = router