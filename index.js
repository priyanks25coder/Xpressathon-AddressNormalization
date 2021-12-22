var express = require("express");
const cors = require("cors");
var NodeGeocoder = require('node-geocoder');
const Address = require('./Address')
const dotenv=require('dotenv');

var app = express();

dotenv.config({path:'./config.env'});

const PORT = process.env.PORT || 4000;
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// var geocoder = NodeGeocoder({
//     provider: 'opencage',
//     apiKey: process.env.APIKEY
// });

  
 
app.get("/", (req, res) => {
    
    var inp="#DH103337 Rustomjee Ease Zone Mall , Opposite Rustomjee Ozone Tower , Vasari Hill Road , Malad West , Mumbai-400064Maharashtra";

    const ad= new Address(inp)
    const out=ad.correctAddress()
    console.log(out)
    // inp= inp.replace(',',' ')
    // const regex=/,/g
    // inp= inp.replace(regex,' ')
    // var inp_arr=inp.split(' ')

    // const mset=new Set()
    // inp_arr.forEach(element => {
    //     element=element.trim()
    //     if(element !='')
    //         mset.add(element)
    // });
    // console.log(mset)
    // // for(var i=0;)

    

    // const state=(statefm.get(maxele).value).toUpperCase()
    // console.log(state)

    // values={}
    // maxval=0
    // maxele=''
    // count=0
    // var flag=0
    // mset.forEach(element=>{
    //     var temp=locfm.get(element).distance
    //     console.log(element,temp)
    //     if(temp!=null){
    //         values[element]=temp
    //         if(temp>maxval){
    //             var count=favloc.indexOf(locfm.get(element).value)
    //             console.log(orgloc.results[count]["StateName"])
    //             if(orgloc.results[count]["StateName"]==state){
    //                 maxval=temp
    //                 maxele=element
    //                 flag=1
    //             }
    //         }
    //     }

    // })
    
    // if(flag==1){
    //     const locality=(locfm.get(maxele).value).trim()
    //     console.log(locality)
    //     var count=favloc.indexOf(locality)
    //     let matchadd=orgloc.results[count]
    //     const pincode=matchadd['Pincode']
    //     const city=matchadd['Districtname']
    // }
    //near beside accross opp next to 
    // geocoder.geocode('banglore', function(err, res) {
    //     console.log(res);
    // });
    
    res.end()
});

app.listen(PORT, () => {
	console.log(`App listening on ${PORT}`);
});