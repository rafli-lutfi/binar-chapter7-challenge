require("dotenv").config();

const { 
  DB_USERNAME, 
  DB_PASSWORD, 
  DB_NAME, 
  DB_HOST, 
  DB_DIALECT = "postgres",
  DB_PORT = 5432,
} = process.env;

module.exports = {
  "development": {
    "username": DB_USERNAME,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "host": DB_HOST,
    "dialect": DB_DIALECT,
    "port": DB_PORT
  },
  "test": {
    "username": DB_USERNAME,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "host": DB_HOST,
    "dialect": DB_DIALECT,
    "port": DB_PORT
  },
  "production": {
    "username": DB_USERNAME,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "host": DB_HOST,
    "dialect": DB_DIALECT,
    "port": DB_PORT
  },
};
