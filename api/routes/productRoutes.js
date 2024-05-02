const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const productModel = require('../models/productModel');
const multer = require('multer');
const userAuth =require('../middleware/authentication');
const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null,'./uploads/');
    },
    filename : function(req, file, cb){
        cb(null,file.originalname);
    }
})
const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/jpeg'|| file.mimetype === 'image/png'){
        cb(null,true)
    }else {
        cb(null,false);
    }
}
const upload = multer({
    storage : storage,
    limits : {
        fileSize : 1024 *1024 * 5
    },
    fileFilter : fileFilter
});

router.get('/',(req, res)=>{
    productModel.find().then((data)=>{
        const response = {
            count : data.length,
            data  : data.map (doc =>{
                return {
                    name : doc.name,
                    price : doc.price,
                    _id : doc._id,
                    productImage : doc.productImage,
                    request : {
                        type :'GET',
                        url : "http://localhost:3000/products/"+doc._id
                    }
                }
            })
        }
        res.status(200).json({
            message : "all products",
            items : response
        });
    }).catch((err)=>{
        res.status(500).json({message : "Error in fetching data"});
    });
   
});

router.post('/',userAuth,upload.single('productImage'),(req, res)=>{
    console.log(req.file);
    const item = new productModel({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price,
        productImage : req.file.path 
    });
    item.save()
    .then((data)=>{
        console.log(data)
        res.status(200).json({
            message : "item added successfully!"
        })
    }).catch((err)=>res.status(500).json({
        error : err
    }));
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
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    productModel.findByIdAndUpdate({_id : req.params.id},{$set :updateOps }).then((result)=>res.status(200).json({message : " updated successfully!", result : result})).catch((err)=>{
        res.status(500).json({error : err});
    })
});

router.delete('/:id',(req, res)=>{
    productModel.findByIdAndDelete({_id : req.params.id}).then((data)=>{
        res.status(200).json({message : "deleted successfully",item : data})}).catch((err)=>{
            res.status(500).json({error : "error in deleting product!"});
        })
    })


module.exports = router;