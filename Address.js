const {statefm,locfm,favloc,favcity,cityfm}=require('./StringMatching')
const orgloc = require('./pincode.json')


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
        const spregex=/[`~!@$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi
        // const pinc=gi
        var arr=this.#rawaddressstring.replace(spregex,' ').split(' ')
        
        arr.forEach(element => {
            element=element.replace(/[0-9]{6}/gi,' ')
            element=element.trim()
            if(element!=' ' && element.match(indregex)==null)
                this.#addressarr.add(element)
        });
    }

    #findState(){
        // var values={}
        var maxval=0
        var maxele=''

        this.#addressarr.forEach((element)=>{
            var temp=statefm.get(element).distance
            // console.log(element,temp)
            if(temp!=null){
                // values[element]=temp
                if(temp>maxval){
                    maxval=temp
                    maxele=element
                }
            }
        })

        const state= (statefm.get(maxele).value).toUpperCase().trim()

        if(maxval>0.8){
            this.#finaladdress.state=state;
        }
    }

    #findLocality(){
        var maxval=0
        var maxele=''
        var count=0
        var flag=0
        
        this.#addressarr.forEach(element=>{

            var temp=locfm.get(element).distance
            
            console.log(element,temp,locfm.get(element).value)

            // console.log(element,this.#finaladdress.state,this.#finaladdress.city)

            if(temp!=null && temp>maxval && element.toUpperCase()!=this.#finaladdress.state.toUpperCase() && element.toUpperCase()!=this.#finaladdress.city.toUpperCase()){
                
                
                var count=favloc.indexOf(locfm.get(element).value)

                // console.log(orgloc.results[count])
                
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

        })

        
        // console.log(locfm.get(maxele).value)

        if(flag==1 && maxval>0.6){
            
            const locality=(locfm.get(maxele).value)
            // console.log(locality)
            var count=favloc.indexOf(locality)
            let matchadd=orgloc.results[count]
            // console.log("Matched Record",matchadd)
            
            const pincode=matchadd['Pincode'].trim()
            const city=matchadd['District'].trim().charAt(0).toUpperCase()+matchadd['District'].trim().toLowerCase().slice(1)
            const state=matchadd['StateName'].trim().toUpperCase().charAt(0)+matchadd['StateName'].trim().toLowerCase().slice(1)
            
            // this.#finaladdress.city=city
            this.#finaladdress.pincode=pincode
            this.#finaladdress.locality=locality
            
            if(this.#finaladdress.state=='') this.#finaladdress.state=state
            else this.#finaladdress.state=this.#finaladdress.state.toUpperCase().charAt(0)+this.#finaladdress.state.toLowerCase().slice(1)
            
            if(this.#finaladdress.city=='') this.#finaladdress.city=city

            else if(city!=this.#findCity && this.#finaladdress.city!='') this.#finaladdress.city=city

            else this.#finaladdress.city=this.#finaladdress.city.toUpperCase().charAt(0)+this.#finaladdress.city.toLowerCase().slice(1)

        }
    }

    #findCity(){

        let maxval=0;
        let maxele='';

        this.#addressarr.forEach((element)=>{
            var temp=cityfm.get(element).distance;

            // console.log(element,temp,cityfm.get(element).value)
            
            if(temp!=null && temp>maxval){
                const probcity=cityfm.get(element).value;
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

        const city=(cityfm.get(maxele).value).trim()
        
        if(maxval>0.8){
            
            var count=favcity.indexOf(city);
            let matchadd=orgloc.results[count];
            this.#finaladdress.state=matchadd["StateName"].trim();
            this.#finaladdress.city=city;
            // console.log(city)
        }
        
    }

    correctAddress(){
        this.#preprocessString()
        this.#findState()
        this.#findCity()
        this.#findLocality()
        
        const obj=this.#finaladdress
        return obj
    }

}

module.exports=Address