const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const cookieParser = require('cookie-parser')
const config = require('./src/config/index')
const errorMiddleware = require('./src/errors/error-handler');
const { MongoClient } = require('mongoose/node_modules/mongodb');

const app = express();
const PORT = config.PORT || 5000

app.use(express.json());
app.use(cookieParser());
app.use(cors())

require("./src/routes")(app);
app.use(errorMiddleware)
 
const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server started work on port ${PORT}`))
    } catch (error) {
        console.log(error)
    }
}
start();