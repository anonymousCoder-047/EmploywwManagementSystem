
const express = require('express')
const mongoose = require('mongoose')
const app = express.Router()

mongoose.connect('mongodb://localhost/employee', 
{
    useUnifiedTopology: true, 
    useNewUrlParser: true, 
    useCreateIndex: true 
}).then(() => { })

const empSchema = require('../model/schema/Empschema')
const usrSchema = require('../model/schema/Userschema')
const Employee = mongoose.model('pfs', empSchema)
const Usr = mongoose.model('signups', usrSchema)
const Emp_cash = mongoose.model('employee_details', empSchema)

app.get('/', (req, res) => {
    if(!req.session.user) {
        res.render('login', { 'message': true, 'msg': 'You Need to Login' })
    } else {   
        Employee.find((err, usr) => {
            let usr_data = []
            usr.forEach( u => {
                usr_data.push(u)
            })
            Emp_cash.find((err, usr) => {
                usr.forEach( u => {
                    usr_data.push(u)
                })
            })
            Usr.find((err, usr) => {
                res.render('users', { 'emp': usr_data, 'isLoggedin': true, 'user_name': req.session.user, 
                'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager, 'usr': usr })
            })
        })
    }
})

app.post('/nameUpdate', (req, res) => {
    let usr_data = []
    Usr.updateOne({ _id:req.body.id }, {
        $set: {
            usr_name: req.body.name
        }
    }, (err, user) => {
        Employee.find((err, usr) => {
            usr.forEach( u => {
                usr_data.push(u)
            })
        })
        Emp_cash.find((err, usr) => {
            usr.forEach( u => {
                usr_data.push(u)
            })
        })
        Usr.find((err, usr) => {
            res.render('users', { 'emp': usr_data, 'isLoggedin': true, 'user_name': req.session.user, 
            'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager, 'usr': usr })
        })
    })
})

app.post('/updateUserPermission', (req, res) => {
    Usr.updateOne({ _id:req.body.id }, {
        $set: {
            is_Admin: req.body.make_admin? 'true': 'false',
            is_Manager: req.body.manager? 'true': 'false',
            can_add_emp: req.body.addnew? 'true': 'false'
        }
    }, (err, user) => {
        Employee.find((err, usr) => {
            let usr_data = []
            usr.forEach( u => {
                usr_data.push(u)
            })
            Emp_cash.find((err, usr) => {
                usr.forEach( u => {
                    usr_data.push(u)
                })
            })
            Usr.find((err, usr) => {
                res.render('users', { 'emp': usr_data, 'isLoggedin': true, 'user_name': req.session.user, 
                'is_Admin': usr.is_Admin, 'is_Manager': usr.is_Manager, 'usr': usr })
            })
        })
    })
})


module.exports = app