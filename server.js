var express = require("express");
var bent = require('bent');
var getJson = bent('json');
var app = express();
var cron = require('node-cron');

const pipedrive_apiKey = '79b22e52423359aceb6372bbc1fca78d2dcf972f';
const bling_apikey = "61e6620d4ba29191c5d4c3600f7f2f7692511bf2b5f651adfe3a32c8f432b115c0a71090";

app.use(express.json());

//roda a cada um minuto
cron.schedule('0-59 * * * *', () => {
    getJson(`https://api.pipedrive.com/v1/deals?status=won&start=0&api_token=` + pipedrive_apiKey)
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


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

module.exports = app;