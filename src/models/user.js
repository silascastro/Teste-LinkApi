const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    name: String,
    email: String,
    has_pic: Number,
    pic_hash: Number,
    active_flag: Boolean,
    value: Number
});

module.exports = mongoose.model('User', UserSchema);