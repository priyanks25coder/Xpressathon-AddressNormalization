// const orgloc = require('./locality.json');
const orgloc = require('./static/pincode.json');
var FuzzyMatching = require('fuzzy-matching');
const {words} = require('./static/converttxtfiletoarr');

const favloc=[]
const favcity=[]
const cityset=new Set()
const locset=new Set()

const state = [ "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttarakhand","Uttar Pradesh","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli","Daman and Diu","Delhi","Lakshadweep","Puducherry"]


orgloc.results.forEach(element => {
    // var str=element['Officename ( BO/SO/HO)']
    
    let str=element['OfficeName']
    let len=str.length
    
    let str2=element['District']
     

    let pos=str.indexOf('(')
    if(pos==-1) pos=len-3
    // else pos=pos-3

    str=str.substring(0,pos)
    
    pos=str2.indexOf('(')
    if(pos!=-1) str2=str2.substring(0,pos-1)

    str=str.trim()
    str2=str2.trim()

    if(!words.includes(str.toLowerCase())){
        locset.add(str)
    }
    if(!words.includes(str2.toLowerCase())){
        cityset.add(str2)
    }
    
    favcity.push(str2)    
    favloc.push(str)

    // console.log(str2)

    // if(str2=='WEST'||str2=="SOUTH"||str2=="NORTH"||str2=="EAST"||str2=="NORTH EAST"||str2=="SOUTH WEST"||str2=="NORTH WEST"|| str2=="SOUTH EAST"){
    //     str2=str2+element['StateName']
    //     cityset.add(str2)
    //     favcity.push(str2)
    // }
    // else{ 
    // cityset.add(str2)
    // favcity.push(str2)
    // }
    
});

// console.log(favloc.length)
// console.log(favcity.length)
// console.log(orgloc.results.length)

// console.log(orgloc.results[favcity.indexOf('MUMBAI')])

const locfm=new FuzzyMatching(locset);
const statefm=new FuzzyMatching(state);
const cityfm= new FuzzyMatching(cityset)

const cmpreps=["aboard","about","above","absent","across","afore","after","against","along","alongside","amid","amidst","among","amongst","anenst","apropos","apud","around","aside","astride","at","athwart","atop","barring","before","behind","below","beneath","beside","besides","between","beyond","op","by","circa","concerning","despite","down","during","except","excluding","failing","following","for","forenenst","from","given","including","inside","into","mid","midst","minus","modulo","near","next","on","onto","opposite","out","outside","over","past","regarding","round","than","till","times","toward","towards","under","underneath","unto","upon","versus","via","within"]


const prepsfm=new FuzzyMatching(cmpreps)

module.exports={locfm,statefm,favloc,cityfm,favcity,prepsfm}