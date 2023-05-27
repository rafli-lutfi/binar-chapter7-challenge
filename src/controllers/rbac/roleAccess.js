const {RoleAccess, Role, Module} = require("../../db/models")

async function create (req,res,next){
  try {
    const {role_id, module_id, is_read, is_write} = req.body

    if(!role_id || !module_id || !is_read || !is_write ) throw new Error("missing body request")

    const checkRole = await Role.findOne({where: {id: role_id}})

    if(!checkRole) throw new Error("role not found")

    const checkModule = await Module.findOne({where: {id: module_id}})

    if (!checkModule) throw new Error("module not found")

    const checkRoleAccess = await RoleAccess.findOne({where: {role_id, module_id}})

    if (checkRoleAccess) throw new Error("role access already exist")
    
    const newRoleAccess = await RoleAccess.create({role_id, module_id, is_read, is_write})

    return res.status(201).json({
      status: true,
      message: "success create new role access",
      data: newRoleAccess
    })

  } catch (error) {
    if (
        error.message == "missing body request" || 
        error.message == "role not found" || 
        error.message == "module not found" ||
        error.message == "role access already exist"
      ){
        return res.status(400).json({
          status: false,
          message: error.message,
          data: null
      })
    }
    next(error)
  }
}

async function getAll (req,res,next){
  try {
    const roleAccess = await Role.findAll({order: [["role_id", "ASC"]]})

    return res.status(200).json({
      status: true,
      message: `success get all role access`,
      data: roleAccess
    })
  } catch (error) {
    next(error)
  }
}

async function getDetail (req,res,next){
  try {
    const {role_id, module_id} = req.query
      
    const roleAcess = await RoleAccess.findOne({where: {role_id, module_id}})
    
    if (!roleAcess) throw new Error("role access not found")

    return res.status(200).json({
      status: true, 
      message: "success get detail role access",
      data: roleAcess
    })

  } catch (error) {

    if(error.message == "role access not found"){
      return res.status(400).json({
        status: false, 
        message: error.message,
        data: null
      })
    }

    next(error)
  }
}

async function update (req,res,next){
  try {
    const {role_id, module_id} = req.query
    const {is_read, is_write} = req.body

    if (!role_id || !module_id) throw new Error("missing query parameter")

    if (!is_read && !is_write) throw new Error("missing request body")

    const checkRoleAccess = await RoleAccess.findOne({where: {role_id, module_id}})
    
    if (!checkRoleAccess) throw new Error("role access not found")

    await RoleAccess.update({is_read, is_write}, {where: {role_id, module_id}})

    return res.status(200).json({
      status: true,
      message: "success update role access",
      data: null
    })

  } catch (error) {

    if(error.message == "missing body request" || error.message == "missing query parameter" || error.message == "role access not found"){
      return res.status(400).json({
        status: false,
        message: error.message,
        data: null,
      })
    }

    next(error)
  }
}

async function deleteRoleAccess (req,res,next){
  try {
    const {role_id, module_id} = req.query
    
    if(!role_id || !module_id) throw new Error("missing query parameter")

    const checkRoleAccess = await RoleAccess.findOne({where: {role_id, module_id}})
    
    if(!checkRoleAccess) throw new Error("role access not found")

    await RoleAccess.destroy({where: {role_id, module_id}})

    return res.status(200).json({
      status: true,
      message: "success delete role access",
      data: null
    })

  } catch (error) {

    if (error.message == "missing query parameter" || error.message == "role access not found"){
      return res.status(400).json({
        status: false,
        message: error.message,
        data: null,
      })
    }

    next(error)
  }
}

module.exports = {
  create,
  getAll,
  getDetail,
  update,
  delete: deleteRoleAccess
}