const Deal = require('../models/deal');
const product = require('../models/product');

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

exports.createDeal = (req, res, next) => {
    const deal = new Deal({
        cod: 3,
        creator: "silas",
        client: "Bill Gates",
        client_organization: "Microsfot",
        items: [
            "60356234d886631e4c81ca47",
            "603565ef7a2f3d329c060ed4",
        ],
        total: 2000
    });

    deal.save(deal, (err, result) => {
        if (result)
            res.send(result);
        else
            res.send({
                msg: "Aconteceu um erro"
            });
    })
}

exports.deleteOne = (req, res) => {
    const id = req.params.id;
    product.deleteOne(id).then(result => {
        if (!result){
            res.send({
                msg: "Aconteceu um erro"
            });
        }else{
        res.send(result);
        }



    })

}

exports.insertDealToDeals = (req, res, next) => {

};