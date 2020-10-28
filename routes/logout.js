
const express = require('express')
const app = express.Router()

app.get('/', (req, res) => {
    if( !req.session.user ) {
        message = true,
        msg = 'Please Login'
        res.render('login', { 'message': message, 'msg': msg })
    } else {
        req.session.destroy(function(err) {
            if(err) throw err;
            res.render('login', { 'message': true, 'msg': 'Please Login' })
        })
    }
}) 

module.exports = app