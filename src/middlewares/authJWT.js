const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(401).json({
        status: false,
        message: "you are not authorized please login first",
        data: null,
      });
    }

    const data = jwt.verify(token, JWT_SECRET_KEY);
    req.user = {
      id: data.id,
      username: data.username
    };

    next();
  } catch (err) {
    next(err)
  }
};

module.exports = {
  auth: authenticateToken,
};
