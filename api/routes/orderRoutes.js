const express = require('express');
const router = express.Router();
const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');
const { default: mongoose } = require('mongoose');

router.get('/',(req, res)=>{
   orderModel.find().populate({"path" :"product_id"}).then((data)=>{
    const response = {
        count : data.length,
        data : data.map((item)=>{
            return {
                product_id : item.product_id,
                quantity : item.quantity,
                _id:item._id,
                data : {
                    method : 'GET',
                    url : 'http://localhost:3000/orders/'+item._id
                }
            }
        })
    }
    res.status(200).json({message : "all orders fetched successfully!",data : response});
   }).catch((err)=>{
    res.status(500).send(err);
   })
});

router.post('/',(req, res)=>{
    const order = new orderModel({
        _id : new mongoose.Types.ObjectId(),
        quantity : req.body.quantity,
        product_id : req.body.product_id
    });
    order.save().then((data)=>{
        console.log(data);
        res.status(201).json({message : "product created successfully!",data : data});
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({error : err});
    })
});

router.get('/:_id',(req, res)=>{
    orderModel.findById({_id : req.params._id}).then((data)=>{
        res.status(200).json({message: "order fetched successfully!",data : data});
    }).catch((err)=>{
        res.status(500).json({err: err});
    });
})

router.delete('/:_id',(req, res)=>{
    orderModel.findByIdAndDelete({_id:req.params._id}).then((data)=>{
        res.status(200).json({message : "Order deleted successfully!", data : data});
    }).catch((err)=>{
        res.status(500).json({error : err});
    })
})

module.exports = router;