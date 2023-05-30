const user = require("./user")
const component = require("./component")
const supplier = require("./supplier")
const product = require("./product")
const component_supplier = require("./component_supplier")
const product_component = require("./product_component")
const role = require("./rbac/role")
const rbacModule = require("./rbac/module")
const roleAccess = require("./rbac/roleAccess")
const media = require("./media")

module.exports = {
  user,
  component,
  supplier,
  product,
  component_supplier,
  product_component,
  role,
  rbacModule,
  roleAccess,
  media
}