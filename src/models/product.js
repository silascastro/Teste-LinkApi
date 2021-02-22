const mongoose = require('mongoose');
const {Schema} = mongoose;

var ProductSchema = new Schema({
    cod: Number,
    description: String,
    qtd: String,
    price: String,
});

module.exports = mongoose.model('Product', ProductSchema);
