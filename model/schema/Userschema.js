
const mongoose = require('mongoose')
module.exports = new mongoose.Schema({
    usr_name: String,
    usr_email: String,
    usr_passwd: String,
    is_Admin: {
        type: String,
        default: false
    },
    is_Manager: {
        type: String,
        default: false
    },
    can_add_emp: {
        type: String,
        default: false
    }
});

