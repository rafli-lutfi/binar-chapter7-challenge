const router = require("express").Router()
const middlewares = require("../middlewares/authJWT")
const {product} = require("../controllers")

router.get("/", product.getAll)
router.get("/:product_id", product.getDetail)
router.post("/", middlewares.auth, product.create)
router.put("/:product_id", middlewares.auth, product.update)
router.delete("/", middlewares.auth, product.delete)

module.exports = router