const mongoose = require('mongoose');
const {Schema} = mongoose;

var DealSchema = new Schema({
    cod: Number,
    creator: String,
    client: String,
    client_organization: String,
    items: [
        /*{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }*/
        {
            cod: Number,
            description: String,
            qtde: Number,
            price: Number,
            
        }
    ],
    total: Number,
    data: String,
});

module.exports = mongoose.model('Deal', DealSchema);
