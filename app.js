
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const bodyParser = require('body-parser') 
const logger = require('morgan')
const app = express()

const login = require('./routes/login')
const signup = require('./routes/signup')
const forget = require('./routes/forget')
const logout = require('./routes/logout')
const registeremp = require('./routes/registeremp') 
const attendance = require('./routes/attendance')
const dashboard = require('./routes/dashboard')
const empreport = require('./routes/empreport')
const cashReport = require('./routes/empreport_cash')
const users = require('./routes/users')

mongoose.connect('mongodb://localhost/employee', 
{
    useUnifiedTopology: true, 
    useNewUrlParser: true, 
    useCreateIndex: true 
}).then(() => { })

const usrSchema = require('./model/schema/Userschema')
const Usr = mongoose.model('signup', usrSchema)

app.use(logger('dev'))
app.use('/public', express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({ 
  secret: 'AHM-secret',
  name: 'sid',resave: true,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 },
  saveUninitialized: true 
}))

app.use('/login', login)
app.use('/register', signup)
app.use('/signup', signup)
app.use('/forgot', forget)
app.use('/registerEmp', registeremp)
app.use('/attendance', attendance)
app.use('/empreport', empreport)
app.use('/logout', logout)
app.use('/dashboard', dashboard)
app.use('/cashReport', cashReport)
app.use('/users', users)

app.set('view engine', 'ejs')

app.get('/', (req,res) => {
  if(!req.session.user) {
    res.render('login', { 'message': true, 'msg': 'Please Login' })
  } else {
    Usr.find({ usr_name: req.session.user }, (err, usr) => {
      usr.forEach( u => {
        res.render('index', { 'isLoggedin': true, 'user_name': req.session.user, 'is_Admin': u.is_Admin, 'is_Manager': u.is_Manager })
      })
    })
  } 
})

const port = process.env.port || 8080
app.listen( port, () => console.log(`listening on port ${port}`) )