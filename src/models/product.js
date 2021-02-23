const mongoose = require('mongoose');
const {Schema} = mongoose;

var ProductSchema = new Schema({
    cod: Number,
    description: String,
    price: Number,
});

module.exports = mongoose.model('Product', ProductSchema);
