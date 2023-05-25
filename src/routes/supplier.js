const router = require("express").Router()
const middlewares = require("../middlewares/authJWT")
const {supplier} = require("../controllers")

router.get("/", supplier.getAll)
router.get("/:supplier_id", supplier.getDetail)
router.post("/", middlewares.auth,supplier.create)
router.put("/:supplier_id", middlewares.auth, supplier.update)
router.delete("/", middlewares.auth, supplier.delete)

module.exports = router