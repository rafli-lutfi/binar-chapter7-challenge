const { Module, RoleAccess } = require("../db/models");

function rbac(moduleName, is_read = false, is_write = false) {
  return async (req, res, next) => {
    try {
      const { role_id } = req.user;

      const module = await Module.findOne({ where: { name: moduleName } });

      const roleAccess = await RoleAccess.findOne({ where: { module_id: module.id, role_id: role_id} });

      if (!roleAccess) throw new Error("you're forbidden to access this site");

      if (is_read && !roleAccess.is_read) throw new Error("you're forbidden to access this site");

      if (is_write && !roleAccess.is_write) throw new Error("you're forbidden to access this site");

      next();
    } catch (err) {
      if (err.message == "you're forbidden to access this site") {
        return res.status(403).json({
          status: false,
          message: err.message,
          data: null,
        });
      }

      next(err);
    }
  };
}

module.exports = rbac
