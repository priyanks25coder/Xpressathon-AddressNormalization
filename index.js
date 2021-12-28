var express = require("express");
const cors = require("cors");
var NodeGeocoder = require('node-geocoder');
const Address = require('./Address')
const dotenv=require('dotenv');

var app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

dotenv.config({path:'./config.env'});

const PORT = process.env.PORT || 4000;
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// var geocoder = NodeGeocoder({
//     provider: 'opencage',
//     apiKey: process.env.APIKEY
// });

app.post("/", (req, res) => {
    
    var inparr=req.body.addresses
    let outarr=[]

    try{
        inparr.forEach(element => {
            const ad= new Address(element)
            const out=ad.correctAddress()
            outarr.push(out)
        });

        res.status(200).send({"addresses":outarr}).end()
    }
    
    catch(err){
        res.status(500).send(err.message).end()
    }

});

app.listen(PORT, () => {
	console.log(`App listening on ${PORT}`);
});