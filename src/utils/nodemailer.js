const nodemailer = require("nodemailer")
const {oauth2Client} = require("./googleOAuth2")
const ejs = require("ejs")
const {
  GOOGLE_REFRESH_TOKEN,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_SENDER_EMAIL,
} = process.env

oauth2Client.setCredentials({refresh_token: GOOGLE_REFRESH_TOKEN})

async function sendMail(to, subject, html) {
  const accessToken = await oauth2Client.getAccessToken()

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: GOOGLE_SENDER_EMAIL,
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      refreshToken: GOOGLE_REFRESH_TOKEN,
      accessToken: accessToken
    }
  })

  transport.sendMail({to, subject, html})
}

function getHtml(filename, data) {
  return new Promise((resolve, reject) => {
    const filepath = `${__dirname}/../views/templateEmail/${filename}`

    ejs.renderFile(filepath, data, (err, data) => {
      if(err) {
        return reject(err)
      }
      return resolve(data)
    })  
  })
}

module.exports = {
  sendMail,
  getHtml
}