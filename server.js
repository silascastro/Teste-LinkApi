var express = require("express");
var app = express();
const mongoose = require('mongoose');
const config = require('./src/app/config');
app.use(express.json());

//mongodbConnection
mongoose.connect(config.mongo, {     useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('error', (e)=>{
    console.log('Falha ao conectar com o Banco de dados'),
    console.log(e);
    process.exit(1)
})


//routes
const Deal = require('./src/routes/deal');
const Product = require('./src/routes/product');
app.use('/deals',Deal);
app.use('/products',Product);

//pipedriver listener
require('./src/app/listener');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
