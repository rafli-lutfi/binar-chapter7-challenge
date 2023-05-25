const router = require("express").Router()
const {product_component}  = require("../controllers")
const middlewares = require("../middlewares/authJWT")

router.post("/add", middlewares.auth, product_component.add)
router.delete("/remove", middlewares.auth, product_component.remove)

module.exports = router