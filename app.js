const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const productRouter = require('./api/routes/productRoutes');
const orderRouter = require('./api/routes/orderRoutes');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/restAPI").then(()=>console.log("database connected!")).catch((err)=>console.log(err));

app.use(morgan('dev')); 
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json()); 
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","*");
    if(req.method == "OPTIONS"){
        res.header("Access-Control-Allow-Methods","POST,PUT,PATCH,GET,DELETE");
    }

    next();
})


app.use('/products',productRouter);
app.use('/orders',orderRouter);

app.use((req, res,next)=>{
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req ,res ,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message : error.message
        }
    })
})


module.exports = app;