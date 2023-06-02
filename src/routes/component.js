const router = require("express").Router()
const jwt = require("../middlewares/authJWT")
const rbac = require("../middlewares/rbac")
const {component} = require("../controllers")
const enums = require("../utils/enums")


router.get("/", rbac(enums.production, true, false), component.getAll)
router.get("/:component_id", rbac(enums.production, true, false), component.getDetail)
router.post("/", rbac(enums.production, true, true), component.create)
router.put("/:component_id", rbac(enums.production, true, true), component.update)
router.delete("/", rbac(enums.production, true, true), component.delete)

module.exports = router