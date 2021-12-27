var readTextFile = require('read-text-file');
var fs=require('fs')
const Address = require('./Address')
var contents = readTextFile.readSync('./static/address.txt');

const adds=contents.split('\r\n')

let out=[]

adds.forEach((ele)=>{
    const adobj= new Address(ele)
    const adnorm=adobj.correctAddress()
    out.push(adnorm)
})

const jsoutput=JSON.stringify({"addresses":out})

fs.writeFileSync('output.json',jsoutput,err=>{
    if(err){
        console.log(err)
    }
    console.log("Output Written in File!!")
})

