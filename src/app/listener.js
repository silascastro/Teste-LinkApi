var bent = require('bent');
var getJson = bent('json');
const xml2json = require('xml2js');
//XML

const Product = require('../models/product');
const Deal = require('../models/deal');
const Deals = require('../models/deals');

var cron = require('node-cron');
const config = require('./config');


//roda a cada um minuto
cron.schedule('0-59 * * * *', () => {
    getJson(`https://api.pipedrive.com/v1/deals?status=won&start=0&api_token=` + config.pipedrive_apiKey)
        .then(resp => {
            if (resp.data != null) {

                var deals_won = resp.data;
                for (let e = 0; e < deals_won.length; e++) {
                    cadastraPedido(deals_won[e].id,deals_won[e].user_id.name, deals_won[e].person_id.name, deals_won[e].org_id.name);
                }
            }
        }).catch(err => {
            //console.log(err);
        });
});

function obterProdutos(deal_id, creator_name,client_name,client_org) {
    //obter produtos de uma determinada deal
    getJson('https://api.pipedrive.com/v1/deals/' + deal_id + '/products?api_token=' + config.pipedrive_apiKey)
        .then(response => {
            const items = (response.data).map((e) => {
                saveProduct(e);
                return item = {
                    codigo: e.id,
                    descricao: e.name,
                    qtde: e.quantity,
                    vlr_unit: e.item_price
                };
            });
            
            sendToBling(deal_id, creator_name,client_name, client_org, items);

            //console.log(xml);

        }).catch(err => {
            
        });
}


function sendToBling(deal_id, creator_name, client_name,client_org, item) {
    //aqui os dados do pedido são organizados
    const pedidos = {
        pedido: {
            numero: deal_id,
            cliente: {
                nome: client_name,
            },
            items: {item}
        }
    }
    var builder = new xml2json.Builder();
    var xml = builder.buildObject(pedidos);
    //enviamos o xml com os produtos para a api do bling
    const post = bent('https://bling.com.br/Api/v2/pedido/json/?apikey='+config.bling_apikey+'&xml='+xml, 'POST', 'json', 201);
    const response = post('',{});
    response.then(resp => {
        getJson('http://localhost:3000/products').then(resp => {
            console.log(resp);
        })
    }).catch(err => {
        console.log(err);
    });
    
    //salva dados do pedido no Mongo
    saveDeal(deal_id, creator_name,client_name,client_org,item);
}

function saveProduct(p){
    Product.findOne({description: p.name}, (err, result)=> {
        if(result){
            if(result.length == 0){
                const product = new Product({
                    cod: p.id,
                    description: p.name,
                    price: p.price,
                });
                product.save(product,(err, result)=> {
                    if(result)
                        console.log(result);
                    else
                    console.log({msg: "Aconteceu um erro ao salvar produto"});
                });
            }else{
                if(result.price != p.price){
                    Product.findOneAndUpdate({description: p.name},{price: p.price},(err, result)=> {
                        if(result)
                            console.log('preço atualizado!');
                    })
                }
            }
        }else{
            console.log(err);
        }
    })

}

function saveDeal(id, creator_name, client_name,client_org, items){
    items.map(e => {
        const descriptions = items.map(e => e.description);
        Product.find({description: descriptions}, (err, result)=> {
            const deal = new Deal({
                cod: id,
                creator: creator_name,
                client: client_name,
                client_organization: client_org,
                items: result.map(item => item._id),
                total: result.map(prod => prod.price).reduce((total, preco) => total+preco)
            })
        })
    })
}

function cadastraPedido(id, creator_name, client_name, client_org) {


    
    getJson('https://bling.com.br/Api/v2/pedido/' + id + '/json/?apikey=' + config.bling_apikey)
        .then(resp => {
            if (!resp.retorno.pedidos) {
                //se pedido não estiver cadastrado então pode ser cadastrado!
                obterProdutos(id, creator_name,client_name, client_org);
            }
        });
}