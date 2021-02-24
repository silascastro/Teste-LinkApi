var bent = require('bent');
var getJson = bent('json');
const xml2json = require('xml2js');
//XML
const mongoose = require('mongoose');
const Deal = require('../models/deal');
const DailyDeals = require('../models/dailydeals');

var cron = require('node-cron');
const config = require('./config');
const dailydeals = require('../models/dailydeals');



//roda a cada um minuto
cron.schedule('0-59 * * * *', () => {
    getJson(`https://api.pipedrive.com/v1/deals?status=won&start=0&api_token=` + config.pipedrive_apiKey)
        .then(resp => {
            if (resp.data != null) {

                var deals_won = resp.data;
                for (let e = 0; e < deals_won.length; e++) {
                    cadastraPedido(deals_won[e].id, deals_won[e].user_id.name, deals_won[e].person_id.name, 
                        deals_won[e].org_id.name,deals_won[e].won_time);
                }
            }
        }).catch(err => {
            //console.log(err);
        });
});

function obterProdutos(deal_id, creator_name, client_name, client_org, data) {
    //obter produtos de uma determinada deal
    getJson('https://api.pipedrive.com/v1/deals/' + deal_id + '/products?api_token=' + config.pipedrive_apiKey)
        .then(response => {
            const items = (response.data).map((e) => {
                //saveProduct(e);
                return item = {
                    codigo: e.id,
                    descricao: e.name,
                    qtde: e.quantity,
                    vlr_unit: e.item_price
                };
            });

            sendToBling(deal_id, creator_name, client_name, client_org, items, data);

            //console.log(xml);

        }).catch(err => {

        });
}


function sendToBling(deal_id, creator_name, client_name, client_org, item, data) {
    //aqui os dados do pedido são organizados
    const pedidos = {
        pedido: {
            numero: deal_id,
            cliente: {
                nome: client_name,
            },
            items: {
                item
            },
        }
    }
    var builder = new xml2json.Builder();
    var xml = builder.buildObject(pedidos);
    //enviamos o xml com os produtos para a api do bling
    const post = bent('https://bling.com.br/Api/v2/pedido/json/?apikey=' + config.bling_apikey + '&xml=' + xml, 'POST', 'json', 201);
    const response = post('', {});
    response.then(resp => {
        console.log(resp);
    }).catch(err => {
        console.log(err);
    });

    //salva dados do pedido no Mongo
    saveDeal(deal_id, creator_name, client_name, client_org, item, data);
}


function saveDeal(id, creator_name, client_name, client_org, items,data) {
    const products = items.map(e => {return {cod: e.codigo,description: e.descricao,qtde: e.qtde,price: e.vlr_unit}})
    const deal = new Deal({
        cod: id,
        creator: creator_name,
        client: client_name ,
        client_organization: client_org,
        items: products,
        total: products.map(e => e.price*e.qtde).reduce((total, n) => total+n),
        data: data.split(" ")[0],
    });
    console.log(deal);
    deal.save(deal, (err,result)=>{
        console.log(result);
    });
    saveDealsByDay(deal);
}

function saveDealsByDay(deal){
    DailyDeals.findOne({data: deal.data},(err,result)=> {
        console.log('daily Deals: '+result);
        if(result === null){
            const dailydeals = new DailyDeals({
                pedidos: [
                    mongoose.Types.ObjectId(deal._id)
                ],
                total: deal.total,
                data: deal.data
            });
            dailydeals.save(dailydeals, (err, result)=> {
                if(result)
                    console.log('deals salvas com sucesso!')
                else
                    console.log('erro ao salvar deals!');
            });
            
        }
        if(result!= null){
            const pedidos = result.pedidos;
            pedidos.push(mongoose.Types.ObjectId(deal._id));
            const total = result.total+deal.total;
            DailyDeals.updateOne({_id: result._id},{pedidos, total},(err, result)=> {
                if(result)
                    console.log('dados atualizados com sucesso!');
                else
                console.log('erro ao atualizar!');
            })
        }
        /*
        if(result.length == 1){
            console.log(result);
        }else{
            
        }*/
    })
}

function cadastraPedido(id, creator_name, client_name, client_org, data) {



    getJson('https://bling.com.br/Api/v2/pedido/' + id + '/json/?apikey=' + config.bling_apikey)
        .then(resp => {
            if (!resp.retorno.pedidos) {
                //se pedido não estiver cadastrado então pode ser cadastrado!
                obterProdutos(id, creator_name, client_name, client_org,data);
            }
        });
}