
const express = require('express')
const app = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const sendmail = require('sendmail')();

const usrSchema = require('../model/schema/Userschema')
const Usr = mongoose.model('signups', usrSchema)

app.get('/', (req, res) => {
    if(!req.session.user) {  
        let message = false
        let msg = "Reset your password"
        res.render('forget', { 'message': message, 'msg': msg, 'id': '' })
    } else {
        Usr.find({ usr_name: req.session.user }, (err, usr) => {
            res.render('index', { 'isLoggedin': true, 'user_name': req.session.user, 'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager })
        })
    }
})

app.post('/', (req, res) => {
    let OTP = generateOTP()
    Usr.findOne({ usr_email: req.body.email }, (err, usr) => {
        if(usr) {
            let message = true
            let msg = 'OTP Sent Successfully'
            sendmail({
                from: 'info@anfalhypermarket.com',
                to: req.body.email,
                subject: 'OTP to reset password',
                html: `your OTP for reset password is ${OTP}. Please Do not Share your OTP with anyone, even to our Executive`,
              }, function(err, reply) {
                console.log(err && err.stack);
                console.dir(reply);
            });
            res.render('forget', { 'message': message, 'msg': msg, 'OTP': OTP, 'id': usr._id })
        } if(!usr) {
            res.render('signup', { 'message': true, 'msg': 'No Such Email Found' })
        }
    })
}) 

app.post('/updatePassword', (req, res) => {
    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(req.body.cpass, salt);
    Usr.findOneAndUpdate({ _id: req.body.db_usr_id }, {
        $set: {
            usr_passwd:hash
        }
    }, (err, usr) => {
        if(usr.is_Admin === 'true') res.render('index', { 'isLoggedin': true, 'user_name': req.session.user })
        res.render('dashboard', { 'isLoggedin': true, 'user_name': req.session.user, 'is_Admin': usr.is_Admin, 'is_Manager': is_Manager, 'user_id': usr._id, 'user_email': usr.usr_email })
    })
})

function generateOTP() { 
    var digits = '0123456789'; 
    let OTP = ''; 
    for (let i = 0; i < 4; i++ ) { 
        OTP += digits[Math.floor(Math.random() * 10)]; 
    } 
    return OTP; 
}

module.exports = app