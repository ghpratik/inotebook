const mongoose = require('mongoose');
require('dotenv').config()

const mongoURI = process.env.CONNECTION_STRING;
const connectToMongo = ()=>{
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=> console.log("connected to MongoDB successfully"))
    .catch((error)=> console.log("MongoDB connection failed: ", error.message))
}

module.exports = connectToMongo;