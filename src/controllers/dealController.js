const Deal = require('../models/deal');
const dailyDeal = require('../models/dailydeals');
const dailydeals = require('../models/dailydeals');
const deal = require('../models/deal');

exports.getAllDeals = (req, res, next) => {
    Deal.find((err, result) => {
        if (result && result != null)
            res.status(200).send(result);
        else
            res.status(500).send({
                msg: "Aconteceu um erro"
            });
    })
};

exports.getAllDealsByDay = (req, res, next) => {
    const data = req.params.data;
    dailydeals.findOne({
        data: data
    }, (err, result) => {
        if (result) {
            const total = result.total;
            const data = result.data;
            const pedidos = result.pedidos;
            deal.find({_id: pedidos}, (err, result) => {
                if (result){
                    let obj = {
                        result,
                        total_pedido: total,
                        data: data
                    }
                    res.send(obj);
                }
                    
                else
                    res.send({
                        msg: "Aconteceu um erro"
                    });
            })
        } else
            res.status(500).send({
                msg: "Aconteceu um erro"
            });
    })
};