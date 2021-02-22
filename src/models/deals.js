const mongoose = require('mongoose');
const {Schema} = mongoose;

var DealsSchema = new Schema({
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
    total: Number,
});

module.exports = mongoose.model('Deals', DealsSchema);
