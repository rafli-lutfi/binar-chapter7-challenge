const router = require("express").Router()
const middlewares = require("../middlewares/authJWT")
const {component} = require("../controllers")

router.get("/", component.getAll)
router.get("/:component_id", component.getDetail)
router.post("/", middlewares.auth, component.create)
router.put("/:component_id", middlewares.auth, component.update)
router.delete("/", middlewares.auth, component.delete)

module.exports = router