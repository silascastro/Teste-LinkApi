const Product = require('../models/product');

exports.getAllProduct = (req, res, next) => {
    Product.find({}).then(result => {
        if(result)
            res.send(result);
        res.send({msg: "Aconteceu um erro"});
    }).catch(err => {
        res.send({msg: "Aconteceu um erro"});
    });
};

exports.post = (req, res, next) => {
    const product = new Product(req.body);

    product.save().then(result =>{
        if(result)
            res.send(result);
        res.send({msg: "Aconteceu um erro"});
    }).catch(err => {
        res.send({msg: "Aconteceu um erro"});
    })
}
