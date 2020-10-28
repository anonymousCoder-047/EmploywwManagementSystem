
const express = require('express')
const app = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const usrSchema = require('../model/schema/Userschema')
const Usr = mongoose.model('signup', usrSchema)

mongoose.connect('mongodb://localhost/employee', 
{
    useUnifiedTopology: true, 
    useNewUrlParser: true, 
    useCreateIndex: true 
}).then(() => { })

app.get('/', (req, res) => {
    if( !req.session.user ) {
        message = false
        msg = "Please Signup"
        res.render('signup', { 'messgae': message, 'msg': msg })
    } else { 
        Usr.find({ usr_name: req.session.user }, (err, usr) => {
            res.render('index', { 'isLoggedin': true, 'user_name': req.session.user, 'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager })
        })
    }
})
 
app.post('/', (req, res) => {
    let psw = bcrypt.hashSync(req.body.password, 10)
    let usrData = new Usr({
        usr_name: req.body.name,
        usr_email: req.body.email,
        usr_passwd: psw
    })
    mongoose.model('signups', usrSchema).countDocuments({}, (err,c) => {
        if(c > 0) {
            Usr.findOne({ usr_email:req.body.email }, (err, u_data) => {
                message = true
                msg = "User Already Exist"
                if(u_data) res.render('signup', { 'messgae': message, 'msg': msg })
                else {
                    isLoggedin = true
                    usrData.save().then(() => {
                        req.session.user = usrData.usr_name
                        res.render('dashboard', { 'isLoggedin': true, 
                        'user_name': usrData.usr_name, 
                        'user_id': usrData._id,
                        'user_email': usrData.usr_email,
                        'is_Admin': usrData.is_Admin,
                        'is_Manager': usrData.is_Manager 
                        })
                    })
                }
            })
        } else {
            usrData.save().then(() => {
                req.session.user = usrData.usr_name
                isLoggedin = true
                res.render('index', { 'isLoggedin': true, 'user_name': usrData.usr_name, 'is_Admin': usrData.is_Admin, 'is_Manager': usrData.is_Manager })
            })
        }
    })
    
})

module.exports = app