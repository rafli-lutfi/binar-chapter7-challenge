const router = require("express").Router()
const rbac = require("../middlewares/rbac")
const enums = require("../utils/enums")
const {role, rbacModule, roleAccess} = require("../controllers")

router.get("/roles", rbac(enums.authorization, true, false), role.getAll)
router.get("/roles/:role_id", rbac(enums.authorization, true, false), role.getDetail)
router.post("/roles", rbac(enums.authorization, true, true), role.create)
router.put("/roles/:role_id", rbac(enums.authorization, true, true), role.update)
router.delete("/roles/:role_id", rbac(enums.authorization, true, true), role.delete)

router.get("/modules", rbac(enums.authorization, true, false), rbacModule.getAll)
router.get("/modules/:module_id", rbac(enums.authorization, true, false), rbacModule.getDetail)
router.post("/modules", rbac(enums.authorization, true, true), rbacModule.create)
router.put("/modules/:module_id", rbac(enums.authorization, true, true), rbacModule.update)
router.delete("/modules/:module_id", rbac(enums.authorization, true, true), rbacModule.delete)

router.get("/roleAccess", rbac(enums.authorization, true, false), roleAccess.getAll)
router.get("/roleAccess", rbac(enums.authorization, true, false), roleAccess.getDetail)
router.post("/roleAccess", rbac(enums.authorization, true, true), roleAccess.create)
router.put("/roleAccess", rbac(enums.authorization, true, true), roleAccess.update)
router.delete("/roleAccess", rbac(enums.authorization, true, true), roleAccess.delete)

module.exports = router