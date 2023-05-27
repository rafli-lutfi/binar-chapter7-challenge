const {Role} = require("../../db/models")

async function create (req,res,next){
  try {
    const {name, description} = req.body

    if (!name) throw new Error("missing body request")

    const checkRole = await Role.findOne({where: {name}})
    
    if (checkRole) throw new Error("role already exist")

    const newRole = await Role.create({name, description})

    return res.status(201).json({
      status: true,
      message: "succsess create new role",
      data: newRole
    })
  } catch (error) {
    if (error.message == "missing body request" || error.message == "role already exist"){
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
    const roles = await Role.findAll({order: [["id", "ASC"]]})

    return res.status(200).json({
      status: true,
      message: `success get all role`,
      data: roles
    })
  } catch (error) {
    next(error)
  }
}

async function getDetail (req,res,next){
  try {
    const {role_id} = req.params
      
    const role = await Role.findOne({where: {id: role_id}})
    
    if (!role) throw new Error("role not found")

    return res.status(200).json({
      status: true, 
      message: "success get detail role",
      data: role
    })

  } catch (error) {

    if(error.message == "role not found"){
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
    const {role_id} = req.params
    const {name, description} = req.body

    if (!name && !description) throw new Error("missing body request")

    const checkRole = await Role.findOne({where: {id: role_id}})

    if (!checkRole) throw new Error("role not found")

    await Role.update({name, description},{where: {id: role_id}})

    return res.status(200).json({
      status: true, 
      message: "success update role",
      data: null
    })

  } catch (error) {

    if(error.message == "missing body request" || error.message == "role not found"){
      return res.status(400).json({
        status: false,
        message: error.message,
        data: null,
      })
    }

    next(error)
  }
}

async function deleteRole (req,res,next){
  try {
    const {role_id} = req.params

    const checkRole = await Role.findOne({where: {id: role_id}})

    if (!checkRole) throw new Error("role not found")

    await Role.destroy({where: {id: role_id}})

    return res.status(200).json({
      status: true,
      message: `success delete ${checkRole.name} role`,
      data: null
    })

  } catch (error) {

    if (error.message == "role not found"){
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
  delete: deleteRole
}