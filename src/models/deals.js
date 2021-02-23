const mongoose = require('mongoose');
const {Schema} = mongoose;

var DealsSchema = new Schema({
    id: Number,
    deals: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Deal'
        },
    ],
    date: Date,
    total: Number,
});

module.exports = mongoose.model('Deals', DealsSchema);
