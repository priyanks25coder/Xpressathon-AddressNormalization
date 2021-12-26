var readTextFile = require('read-text-file');
const axios = require('axios')
var fs=require('fs') 
const dotenv=require('dotenv');

dotenv.config({path:'./config.env'});

var contents = readTextFile.readSync('./static/address.txt');

const adds=contents.split('\r\n')

let out=[]

const inpobj = {addresses:[...adds]}


axios.post(process.env.API_DOMAIN,inpobj).then(res=>{
    out=res.data.addresses
}).catch(err=>{
    console.log(err)

})

const jsoutput=JSON.stringify({"addresses":out})

fs.writeFileSync('output.json',jsoutput,err=>{
    if(err){
        console.log(err)
    }
    console.log("Output Written in File!!")
})

