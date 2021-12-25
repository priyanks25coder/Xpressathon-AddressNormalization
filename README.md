<img align="right" src="https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/uxbksvjii3bnptbqjbwe" data-canonical-src="https://gyazo.com/eb5c5741b6a9a16c692170a41a49c858.png"  width="100" height="100" />

## Xpressathon-Address-Normalization  
**Team ID:**  CodeWarriors | **Team Members:** Priyank Shah , Pranjal Goyal |

![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)
### Problem Statament
We needed to develop and API that takes address in RAW format (input), and perform formmating and optimizing the address (removing repetative, null values, correcting fields, speling error etc) and return the final address as a response.

### Solution Approach
- Firstly in order to get all the correct fields (state,city,locality), we decided to use the **Data Govt India Pincode Data Directory** which fetches the information based on locality and State. We can get information regarding state, district and locality as well as latitude and longitude.
- After this, we solved the mispelling problem in fields by the use of **Fuzzy string matching** on fields that are standarized such as State, District using the data obtained from Govt Data Directory.
- At last used **Regex** in each fields of address to trim the extra space as well as removal of special charcters and certain common words.
- We returned the final formatted address as JSON object and wrote the output in file.
- Note: We took special care about data/api used, All the sources are open-source.

### Deployed version:
API Endpoint: https://address-format-project.herokuapp.com/

### Example :

> Input Address

```
{
  "address":""  
}
```

> Output Address

```
{
  "house": "B-221",
  "street": "Backery Street",
  "area": "Naroda",
  "landmark": "Near GIDC",
  "village": "NA",
  "subdistrict": "NA",
  "district": "Ahmedabad",
  "state": "Gujarat",
  "pincode": "382330"
}
```


### How to Run?
After cloning the repo, follow the below steps:
```sh
$ cd (repo path) 
$ npm install
$ node index.js
```

### API Used
Using an Open Source Indian Post api/data directory

**Data Govt India Pincode Directory:**: https://data.gov.in/resources/all-india-pincode-directory-till-last-month

### Mentions

<img src="https://www.xpressbees.com/Xpressathon/assets/img/Logo-Big.png" data-canonical-src="https://gyazo.com/eb5c5741b6a9a16c692170a41a49c858.png" width="400" height="130" />

***We would Like to thank [Xpreebees](https://www.xpressbees.com/xpressathon) team for organizing such an event which helps students in improving their development skills. We enjoyed making this Project.🎇***