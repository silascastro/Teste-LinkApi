var bent = require('bent');
var getJson = bent('json');

var cron = require('node-cron');
const config = require('./config');


//roda a cada um minuto
cron.schedule('0-59 * * * *', () => {
    getJson(`https://api.pipedrive.com/v1/deals?status=won&start=0&api_token=` + config.pipedrive_apiKey)
        .then(resp => {
            if (resp.data != null) {
                console.log(resp.data);
                /*getJson('https://bling.com.br/Api/v2/pedidos/json/?apikey=' + bling_apikey)
                    .then(resp => {
                        console.log(resp);
                    });*/
            }
        }).catch(err => {
            console.log(err);
        });
})