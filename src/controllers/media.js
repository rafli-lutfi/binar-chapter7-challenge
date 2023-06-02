const imagekit = require("../utils/imageKit")

async function avatarUpload(req, res, next){
  try {
    const imageString = req.file.buffer.toString("base64")

    const uploadFile = await imagekit.upload({
      fileName: req.file.originalname,
      file: imageString,
      folder: "Manufacture_API"
    })

    req.uploadFile = {
      imageUrl: uploadFile.url,
    }

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  avatarUpload
}