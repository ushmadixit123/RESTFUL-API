const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const productModel = require('../models/productModel');

router.get('/',(req, res)=>{
    productModel.find().then((data)=>{
        res.status(200).json({
            message : "all products",
            items : data
        });
    }).catch((err)=>{
        res.status(500).json({message : "Error in fetching data"});
    })
   
});

router.post('/',(req, res)=>{
    const item = new productModel({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price
    });
    item.save()
    .then((data)=>{
        console.log(data)
    }).catch((err)=>console.log(err));

    res.status(200).json({
        message : "item added successfully!"
    })
});

router.get('/:_id',(req, res)=>{
    const id = req.params._id;
    productModel.findById(id).then((data)=>{
        if(data){
            res.status(200).json({
                message : "product fetched successfully",
                item : data
            })
        }else{
            res.status(404).json({message : "No Product found by provided ID"});
        }
    }).catch((err)=>{
        res.status(500).json({error : err});
    });
});

router.patch('/:id',(req, res)=>{
    res.status(200).send("product updated");
});

router.delete('/:id',(req, res)=>{
    productModel.findByIdAndDelete({_id : req.params.id}).then((data)=>{
        res.status(200).json({message : "deleted successfully",item : data})}).catch((err)=>{
            res.status(500).json({error : "error in deleting product!"});
        })
    })


module.exports = router;