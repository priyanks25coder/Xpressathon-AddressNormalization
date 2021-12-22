const csv=require('csv-parser')
const fs=require('fs');

const results=[]

fs.createReadStream('pincode.csv')
    .pipe(csv())
    .on('data',(data)=>{
        if(data['District']=='WEST'||data['District']=="SOUTH"||data['District']=="NORTH"||data['District']=="EAST"||data['District']=="NORTH EAST"||data['District']=="SOUTH WEST"||data['District']=="NORTH WEST"|| data['District']=="SOUTH EAST") 
            data['District']=data['District']+' '+data['StateName']
        results.push(data)
    })
    .on('end',()=>{
        // console.log(results)
        
        const obj={"results":results}
        const data=JSON.stringify(obj)
        fs.writeFile('pincode.json',data,err=>{
            if(err){
                throw err
            }
            console.log("Written")
        })
    })