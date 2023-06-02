const router = require("express").Router()
const rbac = require("../middlewares/rbac")
const enums = require("../utils/enums")
const {supplier} = require("../controllers")

router.get("/", rbac(enums.production, true, false),supplier.getAll)
router.get("/:supplier_id", rbac(enums.production, true, false),supplier.getDetail)
router.post("/", rbac(enums.production, true, true),supplier.create)
router.put("/:supplier_id",  rbac(enums.production, true, true),supplier.update)
router.delete("/",  rbac(enums.production, true, true),supplier.delete)

module.exports = router