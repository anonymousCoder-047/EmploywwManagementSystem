
const express = require('express')
const app = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const bodyParser = require('body-parser')
const usrSchema = require('../model/schema/Userschema')
const Usr = mongoose.model('signups', usrSchema)

app.use(bodyParser.urlencoded({ extended: false }))

mongoose.connect('mongodb://localhost/employee', 
{
    useUnifiedTopology: true, 
    useNewUrlParser: true, 
    useCreateIndex: true 
}).then(() => { })

app.get('/', (req, res) => {
    if( !req.session.user ) {
        message = true,
        msg = 'Please Login'
        res.render('login', { 'message': message, 'msg': msg })
    } else {
        Usr.findOne({ usr_name: req.session.user }, (err, usr) => {
            isLoggedin = true
            req.session.user = usr.usr_name
            res.render('index', { 'isLoggedin': true, 'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager, 'user_name': req.session.user })
        })
    }
}) 

app.post('/', (req, res) => {
    Usr.findOne({ usr_email: req.body.email }, (err, usr) => {
        if(usr) {
            let result = bcrypt.compareSync(req.body.password, usr.usr_passwd)
            if(!result) res.render('login', { 'message': true, 'msg': 'Wrong Password' })
            else if( usr.is_Admin === 'true' ) {
                req.session.user = usr.usr_name
                res.render('index', { 'isLoggedin': true, 'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager, 'user_name': usr.usr_name })
            } else {
                req.session.user = usr.usr_name
                res.render('dashboard', { 'isLoggedin': true, 'user_name': req.session.user, 'user_id': usr._id, 
                'is_Manager': usr.is_Manager, 'is_Admin': usr.is_Admin, 'user_email': usr.usr_email })
            }
        }
        if(!usr) {
            res.render('login', { 'message': true, 'msg': 'No Such Email' })
        }
    })
})

module.exports = app;
