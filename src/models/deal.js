const mongoose = require('mongoose');
const {Schema} = mongoose;

var DealSchema = new Schema({
    id: Number,
    creator_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    org_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    status: String,
    date: Date,
    qtd: Number,


});

module.exports = mongoose.model('Deal', DealSchema);
