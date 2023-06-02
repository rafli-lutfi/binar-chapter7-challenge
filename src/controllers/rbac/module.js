const {Module} = require("../../db/models")

async function create (req,res,next){
  try {
    const {name, description} = req.body

    if (!name) throw new Error("missing body request")

    const checkModule = await Module.findOne({where: {name}})
    
    if (checkModule) throw new Error("module already exist")

    const newModule = await Module.Create({name, description})

    return res.status(201).json({
      status: true,
      message: "succsess create new module",
      data: newModule
    })

  } catch (error) {

    if (error.message == "missing body request" || error.message == "module already exist"){
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
    const modules = await Module.findAll({order: [["id", "ASC"]]})

    return res.status(200).json({
      status: true,
      message: `success get all module`,
      data: modules
    })
  } catch (error) {
    next(error)
  }
}

async function getDetail (req,res,next){
  try {
    const {module_id} = req.params
      
    const module = await Module.findOne({where: {id: module_id}})
    
    if (!module) throw new Error("module not found")

    return res.status(200).json({
      status: true, 
      message: "success get detail module",
      data: module
    })

  } catch (error) {

    if(error.message == "module not found"){
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
    const {module_id} = req.params
    const {name, description} = req.body

    if (!name && !description) throw new Error("missing body request")

    const checkModule = await Module.findOne({where: {id: module_id}})

    if (!checkModule) throw new Error("module not found")

    await Module.update({name, description},{where: {id: module_id}})

    return res.status(200).json({
      status: true, 
      message: "success update module",
      data: null
    })

  } catch (error) {

    if(error.message == "missing body request" || error.message == "module not found"){
      return res.status(400).json({
        status: false,
        message: error.message,
        data: null,
      })
    }

    next(error)
  }
}

async function deleteModule (req,res,next){
  try {
    const {module_id} = req.params

    const checkModule = await Module.findOne({where: {id: module_id}})

    if (!checkModule) throw new Error("module not found")

    await Module.destroy({where: {id: module_id}})

    return res.status(200).json({
      status: true,
      message: `success delete ${checkModule.name} module`,
      data: null
    })

  } catch (error) {

    if (error.message == "module not found"){
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
  delete: deleteModule
}