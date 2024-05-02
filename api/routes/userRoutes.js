const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const { mongo, default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// signup route ===================
router.post('/signup',(req, res, next)=>{
    userModel.find({email : req.body.email}).then((data)=>{
        console.log(data);
        if(data.length > 0){
            res.status(409).json({message : "Email already exist!"})
        }
        else {
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                    res.status(500).send(err);
                }
                else{
                    const newUser = new userModel({
                        _id : new mongoose.Types.ObjectId(),
                        email : req.body.email,
                        password : hash
                    });
                    newUser.save().then((data)=>res.status(200).json({
                        message : "User created successfully!",
                        user : data
                    })).catch((err)=>res.status(500).send(err)); 
                }
                
            })
        }
    })
     
});

// user login ===================================

router.post('/login',(req, res, next)=>{
    userModel.find({email : req.body.email}).then((user)=>{
        if(user.length < 1){
            return res.status(401).json({error : "Auth failed"});
        }
        bcrypt.compare(req.body.password,user[0].password,(err, result)=>{
            if(err){
                return res.status(401).json({error : "Auth failed"});
            }
            if(result){
                const token = jwt.sign({email : req.body.email,_id:user[0]._id},"UshmaDixit",{expiresIn : "1h"});
                res.status(200).json({message:"Successful!",token : token});
            }
            else{
                return res.status(401).json({error : "Auth failed"});
            }
           
        })
    }).catch((err)=>{
        res.status(500).json({error : err});
    })
})

// delete user =====================================
router.delete('/:userId',(req, res)=>{
    userModel.find({_id: req.params.userId}).then((data)=>{
        console.log(data)
        if(data.length > 0){
            userModel.findByIdAndDelete({_id: req.params.userId}).then((data)=>{
                res.status(200).send("User deleted successfully!");
            }).catch(err=>res.status(500).json({err:err}));
        }else{
            res.status(500).send("User not found!");
        }
    })
})

module.exports = router;