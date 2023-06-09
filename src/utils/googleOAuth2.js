const {google} = require("googleapis")

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
} = process.env

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
)

function generateAuthURL() {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
  ]
  
  // return url 
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    response_type: "code",
    scope: scopes
  })
}

function setCredentials(code){
  return new Promise(async (resolve, reject) =>{
    try {
      const {tokens} = await oauth2Client.getToken(code)
      
      oauth2Client.setCredentials(tokens)

      return resolve(tokens)
    } catch (err) {
      return reject(err)
    }
  })
}

function getUserData(){
  return new Promise(async (resolve, reject) =>{
    try {
      const oauth2 = google.oauth2({
        version: "v2",
        auth: oauth2Client
      })

      oauth2.userinfo.get((err, res) =>{
        if (err) return reject(err)
        return resolve(res)
      })

    } catch (err) {
      return reject(err)
    }
  })
}

module.exports = {
  oauth2Client,
  generateAuthURL,
  setCredentials,
  getUserData
}