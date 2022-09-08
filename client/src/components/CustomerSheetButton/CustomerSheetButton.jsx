import { Button } from '@mui/material';
import axios from 'axios'
import { useState } from 'react';

function CustomerSheetButton({links}) {
  const [customers, setCustomers] = useState([
    {name: "Radware",apiLink:"https://sheetdb.io/api/v1/pim3khtbje61v", sheetLink:"https://docs.google.com/spreadsheets/d/1U817kbmm1s8BVWy1j3Ml1LfNoUD7SCjPAp-D4-bPnps/edit#gid=0"},
    {name: "DoIT",apiLink:"https://sheetdb.io/api/v1/retscaqo1q29d", sheetLink:"https://docs.google.com/spreadsheets/d/15mUsXuOKmn-t4Daeax6RAKg8z0JTeC1V-Fp1RTmuE2Q/edit#gid=0"},
    {name: "SSC",apiLink:"https://sheetdb.io/api/v1/bbeqnuwbfqkit", sheetLink:"https://docs.google.com/spreadsheets/d/1uhwfA-GNmRfzLTQjLEo-jBnqf9GnXjviCjyiJ00dAZA/edit#gid=0"},
    {name: "Growthspace",apiLink:"https://sheetdb.io/api/v1/ch2bsf6v44mue", sheetLink:"https://docs.google.com/spreadsheets/d/1Ws---SqAdZuHe--3IBDnVoev5fx72aBoRusfAJBlbz0/edit#gid=0"},
  ])
  console.log(links);
  
  async function createCSVofLinks(links, customerIndex){
    console.log(customerIndex);
    let allLinks = [];
      links.forEach((result)=>{
        if("data" in result){
          allLinks = [...allLinks, ...result.data]
        } else { 
         for (const [key, value] of Object.entries(result.events)) {
           allLinks = [...allLinks, ...value]
          }
        }
      })
      const size = 5;
      const chunksOfProfilesArray = [];
      
      for (let i = 0; i < allLinks.length; i+=size) {
        chunksOfProfilesArray.push(allLinks.slice(i,i+size))
      }

    for (let i = 0; i < chunksOfProfilesArray.length; i++) {
      const {data} = await axios.post(`${customers[customerIndex].apiLink}/import/json`,{
        "json": JSON.stringify(chunksOfProfilesArray[i]),
      })
      console.log(data);
    }
  }

  function renderCustomers(){
    return customers.map((customer,idx)=>{
      return(
        <Button
         key={idx}
         onClick={()=>createCSVofLinks(links, idx)}>
          {customer.name}
          <a href={customer.sheetLink}>View Sheet</a>
        </Button>
      )
    })
  }

  return ( 
    <>
     <div className="container">
      <h2>Or Import Results to Customer:</h2>
        {renderCustomers()}
        <div>-</div>
     </div>
    </>
   );
}

export default CustomerSheetButton;