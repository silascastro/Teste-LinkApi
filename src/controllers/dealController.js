const deal = require('../models/deal');

exports.getAllDeals = (req, res, next) => {
    deal.find((err, result) => {
        res.send(result);
    })
};

exports.createDeal = (req, res, next) => {

};





