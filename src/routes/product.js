const router = require("express").Router()
const rbac = require("../middlewares/rbac")
const enums = require("../utils/enums")
const {product} = require("../controllers")


router.get("/", rbac(enums.production, true, false), product.getAll)
router.get("/:product_id", rbac(enums.production, true, false), product.getDetail)
router.post("/", rbac(enums.production, true, true), product.create)
router.put("/:product_id", rbac(enums.production, true, true), product.update)
router.delete("/", rbac(enums.production, true, true), product.delete)

module.exports = router