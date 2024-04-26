const express = require('express');
const router = express.Router();

router.get('/',(req, res)=>{
    res.status(200).send("all order are fetched")
});

router.post('/',(req, res)=>{
    res.status(200).send("order placed!");
})

module.exports = router;