const express = require("express")
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
dotenv.config({path:'./config.env'})
const path = require("path")
app.use(cookieParser())
// Database Connection
const mongodb = require('./db')
mongodb()

app.use(express.json())

// Enable CORS for all routes using middleware
// app.use(cors({
//     origin: 'https://placemaster.onrender.com'
// }));

app.use(cors())

// Routes
app.use('/student', require('./Routes/Student'))
app.use('/admin', require('./Routes/Admin'))
app.use('/admin', require('./Routes/AdminStudent'))
app.use('/employee', require('./Routes/Employee'))
app.use(require('./Routes/ForgotPassword'));

// app.use(express.static(path.join(__dirname, './student/build')))

// app.get('*', function(req, res){
//     res.sendFile(path.join(__dirname, './student/build/index.html'))
// })

app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`)
})
