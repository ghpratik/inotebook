const express = require('express')
var cors = require('cors')
const connectToMongo = require('./db');
connectToMongo();
require('dotenv').config()

const sendMail = require('./controller/sendMail')

const app = express()
const port = process.env.PORT || 5000;
const frontendUrl = process.env.FRONTEND_URL;
app.use(cors({
  origin: ["http://localhost:3000", frontendUrl]
}))
app.use(express.json())

//Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNotebook Backend listening on port ${port}`)
})
