'use strict'

const express = require('express');
const router =  require('./routes/main');

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();


const app = express();
const port = process.env.PORT || 3000;

app.use('/',router);

app.listen(port).on('listening',()=>{
    console.log(`Server listening on http://127.0.0.1:${port}`);
});