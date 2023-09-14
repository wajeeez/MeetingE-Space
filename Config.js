const dotenv = require('dotenv').config();

const port = process.env.PORT
const Base_URL = process.env.Base_URL

module.exports={
    port,
    Base_URL
}