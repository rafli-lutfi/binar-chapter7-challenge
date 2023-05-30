const router = require("express").Router()
const {user, media} = require("../controllers")
const jwt = require("../middlewares/authJWT")
const multer = require("multer")

router.post("/register", user.register)
router.post("/login", user.login)
router.get("/googleOAuth", user.googleOAuth2)
router.post("/updateProfile", jwt.auth, user.updateProfile)
router.post("/uploadAvatar", jwt.auth, multer().single("media"), media.avatarUpload, user.updateProfile)

module.exports = router