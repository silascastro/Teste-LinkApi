const mongoose = require('mongoose');
const {Schema} = mongoose;

var DealSchema = new Schema({
    cod: Number,
    creator: String,
    client: String,
    client_organization: String,
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    //qtd: Number,
    total: Number
});

module.exports = mongoose.model('Deal', DealSchema);
