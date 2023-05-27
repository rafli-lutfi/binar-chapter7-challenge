const router = require("express").Router()
const {user} = require("../controllers")

router.post("/register", user.register)
router.post("/login", user.login)
router.get("/googleOAuth", user.googleOAuth2)

module.exports = router