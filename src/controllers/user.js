const { User, Role } = require("../db/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;

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

    const user = await User.create({ username, email, password: hashedPassword, user_type: "basic", role_id: roleUser.id });

    return res.status(201).json({
      status: true,
      message: "success create new user",
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

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({
        status: false,
        message: "email or password is incorrect",
        data: null,
      });
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
    next(err);
  }
};

module.exports = {
  register,
  login,
};
