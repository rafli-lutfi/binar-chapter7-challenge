const request = require("supertest");

const app = require("../app");
const truncate = require("../utils/truncate");
const dummy = require("../utils/dummy")

// reset database
truncate.user();
truncate.supplier();
truncate.component();
truncate.product();

dummy.component()

const user = {
  username: "sabrina",
  email: "sabrina@email.com",
  password: "123",
  token: "",
};

const suppliers = [
  {
    name: 'PT. DUNLOP INDONESIA',
    address: "Jakarta",
  },
  {
    name: 'PT. Cahaya Indah',
    address: "Bandung",
    component_id: [2,3,4]
  }
]

const components = [
  {
    name: "stang",
    description: "stang motor terbaik",
  },
  {
    name: "ban",
    description: "ban terkuat se Indonesia",
    supplier_id: [1]
  },
]

const product = {
  name: "Honda Brio",
  quantity: 100,
  component_id: [3,4,6]
}

describe("Register Endpoint", () => {

  test("successfully register", async () => {
    const res = await request(app)
      .post("/api/v1/register")
      .send(user);

    expect(res.statusCode).toBe(201);

    expect(res.body.status).toBe(true)
    expect(res.body.message).toBe("success create new user")

    expect(res.body.data).toEqual({
      id: 1,
      username: user.username,
      email: user.email
    })
  });

  test("register failed because missing some data", async () =>{
    const res = await request(app)
    .post("/api/v1/register")
    .send({});

    expect(res.statusCode).toBe(400)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("missing data in request body")

    expect(res.body.data).toBe(null)
  })

  test("register failed because email already exist", async () => {
    const res = await request(app)
    .post("/api/v1/register")
    .send(user);

    expect(res.statusCode).toBe(400);

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("email already been used")

    expect(res.body.data).toBe(null)
  })

}, 6000);

describe("Login Endpoint", () => {
  
  test("successfuly login", async () => {
    const res = await request(app)
    .post("/api/v1/login")
    .send(user)

    expect(res.statusCode).toBe(200);

    expect(res.body.status).toBe(true)
    expect(res.body.message).toBe("success login")

    expect(res.body).toHaveProperty("data")

    user.token = res.body.data
  })

  test("login failed because missing some data", async () =>{
    const res = await request(app)
    .post("/api/v1/login")
    .send({});

    expect(res.statusCode).toBe(400)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("missing data in request body")

    expect(res.body.data).toBe(null)
  })

  test("login failed because input wrong email or password", async () =>{
    const res = await request(app)
    .post("/api/v1/login")
    .send({email: user.email, password: "wrong password"})

    expect(res.statusCode).toBe(400)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("email or password is incorrect")
    
    expect(res.body.data).toBe(null)
  })
})

describe("Create New Supplier Endpoint", () => {

  test("success create new supplier without components id", async () => {
    const res = await request(app)
      .post("/api/v1/suppliers")
      .set("x-access-token", user.token)
      .send(suppliers[0])

    expect(res.statusCode).toBe(201)

    expect(res.body.status).toBe(true)
    expect(res.body.message).toBe("success create new supplier")
    expect(res.body.data).toEqual({
      id: 1,
      name: suppliers[0].name,
      address: suppliers[0].address
    })
  })

  test("success create new supplier including components id", async () => {
    const res = await request(app)
    .post("/api/v1/suppliers")
    .set("x-access-token", user.token)
    .send(suppliers[1])

    expect(res.statusCode).toBe(201)

    expect(res.body.status).toBe(true)
    expect(res.body.message).toBe("success create new supplier and create records in table component_suppliers")
    expect(res.body.data).toEqual({
      id: 2,
      name: suppliers[1].name,
      address: suppliers[1].address,
    })
  })

  test("failed create new supplier because missing some data", async () =>{
    const res = await request(app)
    .post("/api/v1/suppliers")
    .set("x-access-token", user.token)
    .send({name: suppliers[1].name})

    expect(res.statusCode).toBe(400)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("missing data request body")
    expect(res.body.data).toEqual(null)
  })

  test("failed create new supplier including component_id because component_id not array", async () => {
    const res = await request(app)
    .post("/api/v1/suppliers")
    .set("x-access-token", user.token)
    .send({
      name: suppliers[1].name, 
      address: suppliers[1].address,
      component_id: 5
    })

    expect(res.statusCode).toBe(400)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("component id must be an array")
    expect(res.body.data).toEqual(null)
  })
})

describe("Get All Supplier Endpoint", () => {

  test("success get all suppliers", async () =>{
    const res = await request(app)
    .get("/api/v1/suppliers")

    expect(res.statusCode).toBe(200);

    expect(res.body.status).toBe(true)
    expect(res.body.message).toBe("success get all suppliers")
    expect(res.body.data).not.toEqual(null)
  })

  test("failed to get all suppliers because wrong endpoint", async () => {
    const res = await request(app)
    .get("/api/v1/supplierss")

    expect(res.statusCode).toBe(404);

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("page not found 404")
    expect(res.body.data).toEqual(null)
  })
})

describe("Get Detail Supplier Endpoint", () => {

  test("success get detail supplier", async () => {
    const res = await request(app)
    .get("/api/v1/suppliers/2")
    .set("x-access-token", user.token)

    expect(res.statusCode).toBe(200);

    expect(res.body.status).toBe(true)
    expect(res.body.message).toBe("success get detail suppliers")
    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: 2,
        name: suppliers[1].name,
        address: suppliers[1].address,
      })    
    )
    expect(res.body.data.components).not.toEqual(null)
  })

  test("failed get detail supplier because input wrong id", async () => {
    const res = await request(app)
    .get("/api/v1/suppliers/99")
    .set("x-access-token", user.token)

    expect(res.statusCode).toBe(400);

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("supplier not found")
    expect(res.body.data).toEqual(null)
  })

})

describe("Update Supplier Endpoint", () => {
  const updateSupplier = {
    address: "New York City"
  }

  test("success update supplier", async () => {
    const res = await request(app)
    .put("/api/v1/suppliers/1")
    .set("x-access-token", user.token)
    .send(updateSupplier)

    expect(res.statusCode).toBe(200);

    expect(res.body.status).toBe(true)
    expect(res.body.message).toBe("success update supplier id 1")
    expect(res.body.data).toEqual(null)
  })

  test("failed update supplier because missing data in body request", async () =>{
    const res = await request(app)
    .put("/api/v1/suppliers/1")
    .set("x-access-token", user.token)
    .send({})

    expect(res.statusCode).toBe(400);

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("missing data body request")
    expect(res.body.data).toEqual(null)
  })

  test("failed update supplier because id supplier not found", async () =>{
    const res = await request(app)
    .put("/api/v1/suppliers/99")
    .set("x-access-token", user.token)
    .send(updateSupplier)

    expect(res.statusCode).toBe(400);

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("supplier not found")
    expect(res.body.data).toEqual(null)
  })
})

describe("Delete Supplier Endpoint", () => {

  test("success delete supplier", async () =>{
    const res = await request(app)
    .delete("/api/v1/suppliers?supplier_id=2")
    .set("x-access-token", user.token)

    expect(res.statusCode).toBe(200);

    expect(res.body.status).toBe(true)
    expect(res.body.message).toBe("success deleted supplier id 2")
    expect(res.body.data).toEqual(null)
  })

  test("failed delete supplier because missing id in query parameter", async () =>{
    const res = await request(app)
    .delete("/api/v1/suppliers")
    .set("x-access-token", user.token)
    
    expect(res.statusCode).toBe(400);

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("missing supplier id query")
    expect(res.body.data).toEqual(null)
  })

  test("failed delete supplier because id supplier not found", async () =>{
    const res = await request(app)
    .delete("/api/v1/suppliers?supplier_id=99")
    .set("x-access-token", user.token)

    expect(res.statusCode).toBe(400);

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("supplier not found")
    expect(res.body.data).toEqual(null)
  })
})

describe("Create New Component Endpoint", () => {

  test("success create new component without supplier id", async () => {
    const res = await request(app)
    .post("/api/v1/components")
    .set("x-access-token", user.token)
    .send(components[0])

    expect(res.statusCode).toBe(201);

    expect(res.body.status).toBe(true)
    expect(res.body.message).toBe("Success create new component")
    expect(res.body.data).toEqual({
      id: 5,
      name: components[0].name,
      description: components[0].description
    })
  })

  test("success create new component including supplier id", async () => {
    const res = await request(app)
    .post("/api/v1/components")
    .set("x-access-token", user.token)
    .send(components[1])

    expect(res.statusCode).toBe(201);

    expect(res.body.status).toBe(true)
    expect(res.body.message).toBe("Success create new component and create new record in table component_suppliers")
    expect(res.body.data).toEqual({
      id: 6,
      name: components[1].name,
      description: components[1].description
    })  
  })

  test("failed create new component because missing data in request body", async () => {
    const res = await request(app)
    .post("/api/v1/components")
    .set("x-access-token", user.token)
    .send({name: "Bumper"})

    expect(res.statusCode).toBe(400);

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("missing data request body")
    expect(res.body.data).toEqual(null)  
  })

  test("failed create new component including supplier id because supplier id not array", async () => {
    const res = await request(app)
    .post("/api/v1/components")
    .set("x-access-token", user.token)
    .send({
      name: components[1].name, 
      description: components[1].description, 
      supplier_id: 1
    })

    expect(res.statusCode).toBe(400);

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("supllier id must be an array")
    expect(res.body.data).toEqual(null)  
  })
})

describe("Get All Component Endpoint", () => {

  test("success get all component", async () =>{
    const res = await request(app)
      .get("/api/v1/components")

    expect(res.statusCode).toBe(200);

    expect(res.body.status).toBe(true)
    expect(res.body.message).toBe("success get all component")
    expect(res.body.data).not.toEqual(null)
  })

  test("failed get all component because wrong endpoint", async () =>{
    const res = await request(app)
      .get("/api/v1/componentssss")

    expect(res.statusCode).toBe(404);

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("page not found 404")
    expect(res.body.data).toEqual(null)
  })
})

describe("Get Detail Component Endpoint", () => {

  test("success get detail component", async () => {
    const res = await request(app)
      .get("/api/v1/components/1")

    expect(res.statusCode).toBe(200);

    expect(res.body.status).toBe(true)
    expect(res.body.message).toBe("success get detail component")
    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: 1,
        name: "ban",
        description: "ban terkuat se Indonesia",
      })
    )
  })

  test("failed get detail component because component not found", async () => {
    const res = await request(app)
      .get("/api/v1/components/99")

    expect(res.statusCode).toBe(400);

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("component not found")
    expect(res.body.data).toEqual(null)
  })
})

describe("Update Component Endpoint", () => {
  const updateComponent = {
    description: "good quality"
  }

  test("success update component", async () =>{
    const res = await request(app)
      .put("/api/v1/components/1")
      .set("x-access-token", user.token)
      .send(updateComponent)

    expect(res.statusCode).toBe(200);

    expect(res.body.status).toBe(true)
    expect(res.body.message).toBe("success update component")
    expect(res.body.data).toBe(null)
  })

  test("failed update component because missing data in request body", async () =>{
    const res = await request(app)
      .put("/api/v1/components/1")
      .set("x-access-token", user.token)
      .send({})

    expect(res.statusCode).toBe(400);

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("request body is empty")
    expect(res.body.data).toBe(null)
  })

  test("failed update component becuase component not found", async () =>{
    const res = await request(app)
      .put("/api/v1/components/99")
      .set("x-access-token", user.token)
      .send(updateComponent)

    expect(res.statusCode).toBe(400);

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("component not found")
    expect(res.body.data).toBe(null)    
  })
})

describe("Delete Component Endpoint", () => {

  test("success delete component", async () => {
    const res = await request(app)
      .delete("/api/v1/components?component_id=1")
      .set("x-access-token", user.token)

    expect(res.statusCode).toBe(200);

    expect(res.body.status).toBe(true)
    expect(res.body.message).toBe("success delete component")
    expect(res.body.data).toBe(null)
  })

  test("failed delete component because missing id in query parameter", async () => {
    const res = await request(app)
      .delete("/api/v1/components?")
      .set("x-access-token", user.token)

    expect(res.statusCode).toBe(400);

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("missing query paramater")
    expect(res.body.data).toBe(null)
  })
  
  test("failed delete component because component not found", async () => {
    const res = await request(app)
      .delete("/api/v1/components?component_id=99")
      .set("x-access-token", user.token)

    expect(res.statusCode).toBe(400);

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("component not found")
    expect(res.body.data).toBe(null)
  })
})

describe("Add Component Supplier Endpoint", () => {
  
  test("success add component supplier", async () => {
    const res = await request(app)
      .post("/api/v1/componentSuppliers/add?supplier_id=1")
      .set("x-access-token", user.token)
      .send({component_id: [2,3,4]})
    
    expect(res.statusCode).toBe(201)
    
    expect(res.body.status).toBe(true)
    expect(res.body.message).toBe("success create record/records in table component_supplier")
    expect(res.body.data).toEqual(null)
  })

  test("failed add component supplier because missing id supplier in query parameter", async () => {
    const res = await request(app)
      .post("/api/v1/componentSuppliers/add?")
      .set("x-access-token", user.token)
      .send({component_id: [2]})
    
    expect(res.statusCode).toBe(400)
    
    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("missing query parameter")
    expect(res.body.data).toEqual(null)
  })
  
  test("failed add component supplier because missing data in body request", async () => {
    const res = await request(app)
      .post("/api/v1/componentSuppliers/add?supplier_id=1")
      .set("x-access-token", user.token)
      .send({})
    
    expect(res.statusCode).toBe(400)
    
    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("missing body request")
    expect(res.body.data).toEqual(null)
  })
  
  test("failed add component supplier because component id is not array ", async () => {
    const res = await request(app)
      .post("/api/v1/componentSuppliers/add?supplier_id=1")
      .set("x-access-token", user.token)
      .send({component_id: 2})
    
    expect(res.statusCode).toBe(400)
    
    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("component id must be an array")
    expect(res.body.data).toEqual(null)
  })
  
  test("failed add component supplier because there is data that already exist", async () => {
    const res = await request(app)
      .post("/api/v1/componentSuppliers/add?supplier_id=1")
      .set("x-access-token", user.token)
      .send({component_id: [2]})
    
    expect(res.statusCode).toBe(400)
    
    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("there is some data that already exist")
    expect(res.body.data).toEqual(null)
  })
  
  test("failed add component supplier because supplier id not found", async () => {
    const res = await request(app)
      .post("/api/v1/componentSuppliers/add?supplier_id=99")
      .set("x-access-token", user.token)
      .send({component_id: [3,4]})
    
    expect(res.statusCode).toBe(400)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("supplier not found")
    expect(res.body.data).toEqual(null)
  })
})

describe("Remove Component Supplier Endpoint", () => {

  test("success remove component", async () => {
    const res = await request(app)
      .delete("/api/v1/componentSuppliers/remove?supplier_id=1&component_id=2")
      .set("x-access-token", user.token)
    
    expect(res.statusCode).toBe(200)

    expect(res.body.status).toBe(true)
    expect(res.body.message).toBe("success delete records in table component_supplier")
    expect(res.body.data).toEqual(null)
  })
  
  test("failed remove component because missing id supplier or component in parameter query", async () => {
    const res = await request(app)
      .delete("/api/v1/componentSuppliers/remove?component_id=2")
      .set("x-access-token", user.token)
    
    expect(res.statusCode).toBe(400)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("missing id in parameter or query")
    expect(res.body.data).toEqual(null)
  })
  
  test("failed remove component because supplier not found", async () => {
    const res = await request(app)
      .delete("/api/v1/componentSuppliers/remove?supplier_id=99&component_id=2")
      .set("x-access-token", user.token)
    
    expect(res.statusCode).toBe(400)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("supplier not found")
    expect(res.body.data).toEqual(null)
  })
  
  test("failed remove component because component not found", async () => {
    const res = await request(app)
      .delete("/api/v1/componentSuppliers/remove?supplier_id=1&component_id=99")
      .set("x-access-token", user.token)
    
    expect(res.statusCode).toBe(400)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("component not found")
    expect(res.body.data).toEqual(null)
  })
  
  test("failed remove component because record not found", async () => {
    const res = await request(app)
      .delete("/api/v1/componentSuppliers/remove?supplier_id=1&component_id=5")
      .set("x-access-token", user.token)
    
    expect(res.statusCode).toBe(400)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("record not found")
    expect(res.body.data).toEqual(null)
  })
})

describe("Create New Product Endpoint", () => {

  test("success create new product", async () => {
    const res = await request(app)
      .post("/api/v1/products")
      .set("x-access-token", user.token)
      .send(product)

    expect(res.statusCode).toBe(201)

    expect(res.body.status).toBe(true)
    expect(res.body.message).toBe("success create new product and create records in table product_components")
    expect(res.body.data).toEqual({
      id: 1,
      name: product.name,
      quantity: product.quantity
    })
  })

  test("failed create new product because missing data in body request", async () => {
    const res = await request(app)
      .post("/api/v1/products")
      .set("x-access-token", user.token)
      .send({})

    expect(res.statusCode).toBe(400)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("missing body request")
    expect(res.body.data).toEqual(null)
  })

  test("failed create new product because component id not array", async () => {
    const res = await request(app)
      .post("/api/v1/products")
      .set("x-access-token", user.token)
      .send({name: product.name, quantity: product.quantity, component_id: 3})

    expect(res.statusCode).toBe(400)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("component id must be an array")
    expect(res.body.data).toEqual(null)
  })
})

describe("Get All Product Endpoint", () => {

  test("success get all product", async () => {
    const res = await request(app)
    .get("/api/v1/products")

    expect(res.statusCode).toBe(200)

    expect(res.body.status).toBe(true)
    expect(res.body.message).toBe("success get all product")
    expect(res.body.data).not.toEqual(null)
  })
  
  test("failed get all product because wrong endpoint", async () => {
    const res = await request(app)
    .get("/api/v1/productsss")

    expect(res.statusCode).toBe(404)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("page not found 404")
    expect(res.body.data).toEqual(null)  
  })
})

describe("Get Detail Product Endpoint", () => {

  test("success get detail product", async () => {
    const res = await request(app)
    .get("/api/v1/products/1")

    expect(res.statusCode).toBe(200)

    expect(res.body.status).toBe(true)
    expect(res.body.message).toBe("success get detail product")
    expect(res.body.data).toEqual(
      expect.objectContaining({
        id: 1,
        name: product.name,
        quantity: product.quantity        
      })
    )
    expect(res.body.data.components).not.toEqual(null)
  })
  
  test("failed get detail product because product not found", async () => {
    const res = await request(app)
    .get("/api/v1/products/99")

    expect(res.statusCode).toBe(400)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("product not found")
    expect(res.body.data).toEqual(null)
  })  
})

describe("Update Product Endpoint", () => {
  const updateProduct = {
    quantity: 59
  }

  test("success update product", async () => {
    const res = await request(app)
      .put("/api/v1/products/1")
      .set("x-access-token", user.token)
      .send(updateProduct)

      expect(res.statusCode).toBe(200)

      expect(res.body.status).toBe(true)
      expect(res.body.message).toBe("success updated product id 1")
      expect(res.body.data).toEqual(null)
  })
  
  test("failed update product because missing data in body request", async () => {
    const res = await request(app)
      .put("/api/v1/products/1")
      .set("x-access-token", user.token)
      .send({})

      expect(res.statusCode).toBe(400)

      expect(res.body.status).toBe(false)
      expect(res.body.message).toBe("request body is empty")
      expect(res.body.data).toEqual(null)
  })
    
  test("failed update product because id product not found", async () => {
    const res = await request(app)
      .put("/api/v1/products/99")
      .set("x-access-token", user.token)
      .send(updateProduct)

      expect(res.statusCode).toBe(400)

      expect(res.body.status).toBe(false)
      expect(res.body.message).toBe("product not found")
      expect(res.body.data).toEqual(null)
  })
})

describe("Delete Product Endpoint", () => {

  test("success delete product", async () => {
    const res = await request(app)
      .delete("/api/v1/products?product_id=1")
      .set("x-access-token", user.token)

    expect(res.statusCode).toBe(200)

    expect(res.body.status).toBe(true)
    expect(res.body.message).toBe("success delete product id 1")
    expect(res.body.data).toEqual(null)  
  })

  test("failed delete product because id product not found", async () => {
    const res = await request(app)
      .delete("/api/v1/products?product_id=99")
      .set("x-access-token", user.token)

    expect(res.statusCode).toBe(400)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("product not found")
    expect(res.body.data).toEqual(null)  
  })

})

describe("Add Product Component Endpoint", () => {

  test("success add product component", async () => {
    // re-create product after deleted in previous test case
    await request(app)
    .post("/api/v1/products")
    .set("x-access-token", user.token)
    .send(product)

    const res = await request(app)
      .post("/api/v1/productComponents/add?product_id=2")
      .set("x-access-token", user.token)
      .send({component_id: [5]})

    expect(res.statusCode).toBe(201)

    expect(res.body.status).toBe(true)
    expect(res.body.message).toBe("success create records in table product_components")
    expect(res.body.data).toEqual(null)
  })
  
  test("failed add product component because missing id product in query parameter", async () => {
    const res = await request(app)
      .post("/api/v1/productComponents/add?")
      .set("x-access-token", user.token)
      .send({component_id: [5]})

    expect(res.statusCode).toBe(400)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("missing query parameter")
    expect(res.body.data).toEqual(null)
  })
  
  test("failed add product component because missing data in body request", async () => {
    const res = await request(app)
      .post("/api/v1/productComponents/add?product_id=2")
      .set("x-access-token", user.token)
      .send({})

    expect(res.statusCode).toBe(400)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("missing body request")
    expect(res.body.data).toEqual(null)
  })
  
  test("failed add product component because component id is not array", async () => {
    const res = await request(app)
      .post("/api/v1/productComponents/add?product_id=2")
      .set("x-access-token", user.token)
      .send({component_id: 5})

    expect(res.statusCode).toBe(400)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("component_id must be an array")
    expect(res.body.data).toEqual(null)
  })
  
  test("failed add product component because id product not found", async () => {
    const res = await request(app)
      .post("/api/v1/productComponents/add?product_id=99")
      .set("x-access-token", user.token)
      .send({component_id: [5]})

    expect(res.statusCode).toBe(400)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("product not found")
    expect(res.body.data).toEqual(null)
  })
  
  test("failed add product component because", async () => {
    const res = await request(app)
      .post("/api/v1/productComponents/add?product_id=2")
      .set("x-access-token", user.token)
      .send({component_id: [5]})

    expect(res.statusCode).toBe(400)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("there's some data that already exist")
    expect(res.body.data).toEqual(null)
  })
})

describe("Remove Product Component Endpoint", () => {

  test("success remove product component", async () => {
    const res = await request(app)
      .delete("/api/v1/productComponents/remove?product_id=2&component_id=5")
      .set("x-access-token", user.token)

    expect(res.statusCode).toBe(200)

    expect(res.body.status).toBe(true)
    expect(res.body.message).toBe("success deleted record in table product_components")
    expect(res.body.data).toEqual(null)
  })
  
  test("failed remove product component because missing id product or component in query parameter", async () => {
    const res = await request(app)
      .delete("/api/v1/productComponents/remove?product_id=2")
      .set("x-access-token", user.token)

    expect(res.statusCode).toBe(400)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("missing query parameter")
    expect(res.body.data).toEqual(null)
  })
  
  test("failed remove product component because id product not found", async () => {
    const res = await request(app)
      .delete("/api/v1/productComponents/remove?product_id=99&component_id=5")
      .set("x-access-token", user.token)

    expect(res.statusCode).toBe(400)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("product not found")
    expect(res.body.data).toEqual(null)
  })
  
  test("failed remove product component because id component not found", async () => {
    const res = await request(app)
      .delete("/api/v1/productComponents/remove?product_id=2&component_id=99")
      .set("x-access-token", user.token)

    expect(res.statusCode).toBe(400)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("component not found")
    expect(res.body.data).toEqual(null)
  })
  
  test("failed remove product component because record not found", async () => {
    const res = await request(app)
      .delete("/api/v1/productComponents/remove?product_id=2&component_id=2")
      .set("x-access-token", user.token)

    expect(res.statusCode).toBe(400)

    expect(res.body.status).toBe(false)
    expect(res.body.message).toBe("record not found")
    expect(res.body.data).toEqual(null)
  })
})