const mongoose = require('mongoose');
const {Schema} = mongoose;

var DailyDeals = mongoose.Schema({
    pedidos: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Deal'
        },
    ],
    data: String,
    total: Number,
});

DailyDeals.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

module.exports = mongoose.model('DailyDeals', DailyDeals);
