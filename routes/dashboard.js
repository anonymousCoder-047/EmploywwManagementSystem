
const express = require('express')
const app = express.Router()
const mongoose = require('mongoose')

const usrSchema = require('../model/schema/Userschema')
const empSchema = require('../model/schema/Empschema')

const Usr = mongoose.model('signups', usrSchema)
const Emp = mongoose.model('pfs', empSchema)

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
            if( usr.is_Admin === 'true' ) {
                Emp.find((err, emp) => {
                    res.render('empreport', { 'emp': emp, 'isLoggedin': true, 'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager })
                })
            } else {
                    res.render('dashboard', { 
                    'isLoggedin': true, 
                    'user_name': req.session.user, 
                    'user_id': usr._id,
                    'user_email': usr.usr_email,
                    'is_Admin': usr.is_Admin,
                    'is_Manager': usr.is_Manager 
                })
            } 
        })
    }
})

module.exports = app