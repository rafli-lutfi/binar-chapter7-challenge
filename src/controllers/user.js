const { User, Role } = require("../db/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;
const oauth2 = require("../utils/googleOAuth2")
const nodemailer = require("../utils/nodemailer")

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "missing data in request body",
        data: null,
      });
    }

    const checkEmail = await User.findOne({ where: { email } });
    if (checkEmail) {
      return res.status(400).json({
        status: false,
        message: "email already been used",
        data: null,
      });
    }

    const roleUser = await Role.findOne({where: {name: "User"}})

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({ 
      username, 
      email, 
      password: hashedPassword,
      avatar: "https://ik.imagekit.io/tiu0i2v9jz/Manufacture_API/default-avatar.png", 
      user_type: "basic", 
      role_id: roleUser.id,
      verified: false 
    });

    // token for email verificaton 
    const payload = {
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(payload, JWT_SECRET_KEY);
    const url = `${req.protocol}://${req.get("host")}/api/v1/auth/verifyAccount?token=${token}`

    // load template email
    const html = await nodemailer.getHtml("verifyAccount.ejs", {email, url})

    // send email to user
    nodemailer.sendMail(user.email, "verify your account", html)

    return res.status(201).json({
      status: true,
      message: "success create new user, please check email to verify your account",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        user_type: user.user_type,
        role_id: user.role_id
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "missing data in request body",
        data: null,
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "email or password is incorrect",
        data: null,
      });
    }

    if(user.user_type == "google" && !user.password){
      return res.status(400).json({
        status: false,
        message: "your account was registered using google, please login with googleOAuth",
        data: null
      })
    }

    if(!user.verified){
      return res.status(400).json({
        status: false,
        message: "your account is not verified, please check your email to verify",
        data: null
      })
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({
        status: false,
        message: "email or password is incorrect",
        data: null,
      });
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role_id: user.role_id
    };

    const token = jwt.sign(payload, JWT_SECRET_KEY);

    return res.status(200).json({
      status: true,
      message: "success login",
      data: token,
    });
  } catch (err) {
    next(err);
  }
};

const googleOAuth2 = async (req, res, next) =>{
  try {
    const {code} = req.query

    if(!code){
      const googleLoginUrl = oauth2.generateAuthURL()
      return res.redirect(googleLoginUrl)
    }

    await oauth2.setCredentials(code)

    const {data} = await oauth2.getUserData()
    
    let user = await User.findOne({where: {email: data.email}})

    const roleUser = await Role.findOne({where: {name: "User"}})
    
    if(!user){
      user = await User.create({
        username: data.name,
        email: data.email,
        user_type: "google",
        avatar: "https://ik.imagekit.io/tiu0i2v9jz/Manufacture_API/default-avatar.png",
        role_id: roleUser.id,
        verified: true
      })
    }

    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role_id: user.role_id
    };

    const token = jwt.sign(payload, JWT_SECRET_KEY);

    return res.status(200).json({
      status: true,
      message: "success login",
      data: token,
    });
  } catch (err) {
    next(err)
  }
}

const updateProfile = async (req, res, next) =>{
  try {
    const {username, email} = req.body
    let {avatar} = req.body

    if(req.uploadFile) {
      avatar = req.uploadFile.imageUrl
    }

    if (!username && !email && !avatar) {
      return res.status(400).json({
        status: false,
        message: "missing data in request body",
        data: null
      })
    }

    const {id: userId} = req.user

    const checkUser = await User.findOne({where: {id: userId}})
    if(!checkUser){
      return res.status(400).json({
        status: false,
        message: "user not found",
        data: null
      })
    }

    await User.update({username, email, avatar}, {where:{id: userId}})

    return res.status(200).json({
      status: true,
      message: "success update profile",
      data: {
        username,
        email,
        avatar
      }
    })
  } catch (err) {
    next(err)
  }
}

const verifyAccount = async (req, res, next) => {
  try {
    const {token} = req.query
    if(!token) {
      return res.status(401).json({
        status: false,
        message: "invalid token",
        data: null,
      })
    }

    const data = jwt.verify(token, JWT_SECRET_KEY);

    const {email} = data

    const updated = await User.update({verified: true},{where: {email}})
    if(updated[0] == 0){
      return res.status(400).json({
        status: false,
        message: "verify account failed",
        data: null
      })
    }

    return res.status(200).json({
      status: true,
      message: "verify account success, now you can login with this email",
      data: null
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  register,
  login,
  googleOAuth2,
  updateProfile,
  verifyAccount
};
