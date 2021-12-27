const {statefm,locfm,favloc,favcity,cityfm,prepsfm}=require('./StringMatching')
const orgloc = require('./static/pincode.json')

class Address{
    
    #rawaddressstring;
    #addressarr=new Set();
    #finaladdress={
        "addressline1":"",
        "addressline2":"",
        "locality":"",
        "city":"",
        "state":"",
        "pincode":"",
        "geocoder":"",
    };

    constructor(addressstring){
        this.#rawaddressstring=addressstring;
    }

    #preprocessString(){
        // const regex=/,/g
        const indregex=/india/gi
        const spregex=/[`~!@$%^&*()_|+\-=?;:'",<>\{\}\[\]]/gi
        // const pinc=gi
        var arr=this.#rawaddressstring.replace(spregex,' ').split(' ')
        
        arr.forEach(element => {
            element=element.replace(/[0-9]{6}/gi,' ')
            element=element.trim()
            
            if(element!=' ' && element!='' && element.match(indregex)==null){
                if(!(element.length===1 && element.match(/[a-zA-Z]/gi)))
                    this.#addressarr.add(element)
            }
        });
    }

    #findState(){

        var maxval=0
        var maxele=''

        this.#addressarr.forEach((element)=>{
            var temp=statefm.get(element).distance
            
            if(temp!=null){
                if(temp>maxval){
                    maxval=temp
                    maxele=element
                }
            }
        })

        
        if(maxval>0.8){
            const state= (statefm.get(maxele).value).toUpperCase().trim()
            this.#finaladdress.state=state;
            this.#addressarr.delete(maxele)
        }
    }

    #findLocality(){
        var maxval=0
        var maxele=''
        var count=0
        var flag=0
        
        this.#addressarr.forEach(element=>{

            var temp=locfm.get(element).distance
            
            // console.log(element,temp,locfm.get(element).value)

            if(temp!=null && temp>maxval && element.toUpperCase()!=this.#finaladdress.state.toUpperCase() && element.toUpperCase()!=this.#finaladdress.city.toUpperCase()){
                
                let count=favloc.indexOf(locfm.get(element).value)

                if(count==-1){
                    
                    var matloc=locfm.get(element).value
                    var matlocarr=matloc.split(' ')
                    matlocarr.pop()
                    var newloc=''
                    matlocarr.forEach((ele)=>newloc=newloc+' '+ele)
                    count=favloc.indexOf(newloc)
                }
                
                if(count!=-1){
                    
                    if(this.#finaladdress.state!='' && orgloc.results[count]["StateName"]==this.#finaladdress.state){
                        
                        // if(this.#finaladdress.city!='' && orgloc.results[count]["District"]==this.#finaladdress.city){
                        //     maxval=temp
                        //     maxele=element
                        //     flag=1
                        // }
                        
                        // else if(this.#finaladdress.city==' '){
                        //     maxval=temp
                        //     maxele=element
                        //     flag=1                        
                        // }
                        maxval=temp
                        maxele=element
                        flag=1
                    }
                    
                    else if(this.#finaladdress.state==''){
                        if(this.#finaladdress.city!='' && orgloc.results[count]["District"]==this.#finaladdress.city){
                            maxval=temp
                            maxele=element
                            flag=1
                        }
                        else if(this.#finaladdress.city==' '){
                            maxval=temp
                            maxele=element
                            flag=1
                        }
                    }

                }
            }
        })

        if(flag==1 && maxval>0.6){
            
            const locality=(locfm.get(maxele).value)
            // console.log(locality)
            var count=favloc.indexOf(locality)
            let matchadd=orgloc.results[count]
            // console.log("Matched Record",matchadd)
            this.#addressarr.delete(maxele)

            const pincode=matchadd['Pincode'].trim()
            const city=matchadd['District'].trim().charAt(0).toUpperCase()+matchadd['District'].trim().toLowerCase().slice(1)
            const state=matchadd['StateName'].trim().toUpperCase().charAt(0)+matchadd['StateName'].trim().toLowerCase().slice(1)
            
            this.#finaladdress.pincode=pincode
            this.#finaladdress.locality=locality
                        
            if(this.#finaladdress.state=='') this.#finaladdress.state=state
            else this.#finaladdress.state=this.#finaladdress.state.toUpperCase().charAt(0)+this.#finaladdress.state.toLowerCase().slice(1)
            
            if(this.#finaladdress.city=='') this.#finaladdress.city=city

            // else if(city!=this.#findCity && this.#finaladdress.city!='') this.#finaladdress.city=city

            else this.#finaladdress.city=this.#finaladdress.city.toUpperCase().charAt(0)+this.#finaladdress.city.toLowerCase().slice(1)

            this.#finaladdress.geocoder=matchadd["Latitude"]+','+matchadd["Longitude"]

        }

    }

    #findCity(){

        let maxval=0;
        let maxele='';

        this.#addressarr.forEach((element)=>{
            var temp=cityfm.get(element).distance;

            if(temp!=null && temp>maxval){
                let probcity=cityfm.get(element).value;
                
                if(probcity=='BANGALORE') probcity='BENGALURU'
                else if(probcity=='BARODA') probcity='VADODARA'
                
                const count= favcity.indexOf(probcity);
                
                if(this.#finaladdress.state!='' && orgloc.results[count]["StateName"]==this.#finaladdress.state){
                    
                    maxval=temp
                    maxele=element
                }
                else if(this.#finaladdress.state==''){
                    maxval=temp
                    maxele=element
                }

            }
        })

        

        if(maxval>=0.8){
            let maxprobcity=cityfm.get(maxele).value
            
            if(maxprobcity=='BANGALORE') maxprobcity='BENGALURU'
            else if(maxprobcity=='BARODA') maxprobcity='VADODARA'

            const city=maxprobcity.trim()
            this.#addressarr.delete(maxele)
            var count=favcity.indexOf(city);
            let matchadd=orgloc.results[count];
            this.#finaladdress.state=matchadd["StateName"].trim();
            this.#finaladdress.city=city;
        }
        
    }

    #findstreet(){
        let probstreet=[]
        let prepos=-1
        
        this.#addressarr.forEach((element)=>{
            if(element.toUpperCase()!=this.#finaladdress.city.toUpperCase() && element.toUpperCase()!=this.#finaladdress.state.toUpperCase() && element.toUpperCase()!=this.#finaladdress.locality.toUpperCase()){
                probstreet.push(element)
            }
        })
        
        let addl=''
        probstreet.forEach((ele)=>addl=addl+' '+ele)
        
        let maxele=''
        let maxval=0
        
        probstreet.forEach((ele)=>{
            if(prepsfm.get(ele).distance>maxval){
                maxval=prepsfm.get(ele).distance
                maxele=ele
            }
        })

        if(maxval>=0.99){
            // console.log(maxval)
            prepos=probstreet.indexOf(maxele)
        }

        if(prepos==-1){
            prepos=Math.ceil(probstreet.length/2)
        }

        let strpos=addl.indexOf(probstreet[prepos])
        const add2=addl.slice(strpos).trim()
        const add1=addl.slice(0,strpos).trim()

        this.#finaladdress.addressline1=add1;
        this.#finaladdress.addressline2=add2;
    }

    correctAddress(){
        this.#preprocessString()
        this.#findState()
        this.#findCity()
        this.#findLocality()
        this.#findstreet()
        const obj=this.#finaladdress
        return obj
    }

}

module.exports=Address