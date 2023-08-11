'use strict'

const express = require('express');
const router =  require('./routes/main');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/',router);

app.listen(port).on('listening',()=>{
    console.log(`Server listening on http://127.0.0.1:${port}`);
});


module.exports = app;