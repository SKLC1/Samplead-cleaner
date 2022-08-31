
import { Parser } from "json2csv"
import fs from "fs"
import axios from 'axios'
import addLocationToProfile_v2 from "./addLocationToProofile_v2.js";

async function convertToCSV(profiles, getLocations){
  console.log(profiles.length);
  
  for (let i = 0; i < profiles.length; i++) {
    if(profiles[i] !== null){
      if(profiles[i].job.includes(" at ")){
        profiles[i].company = profiles[i].job.split(" at ")[1].split("|")[0];
        profiles[i].title = profiles[i].job.split(" at ")[0];
      } else if (profiles[i].job.includes(" @")){
        profiles[i].company = profiles[i].job.split("@")[1].split("|")[0];
        profiles[i].title = profiles[i].job.split("@")[0];
      } else {
        profiles[i].company = "N/A"
        profiles[i].title = "N/A"
      }
    }
  }
  
  // https://docs.google.com/spreadsheets/d/1wmJ8lWwl3znr6dYC1tM1MRhjlHgZJsUnk-7PiMS6bB4/edit#gid=0
  const {data} = await axios.post('https://sheetdb.io/api/v1/iakojl01kdc99/import/json',{
    "json": JSON.stringify(profiles),
  })
  console.log(data);
  const size = 100;
  const logs = [];
  const chunksOfProfilesArray = [];
  
  for (let i = 0; i < profiles.length; i+=size) {
    chunksOfProfilesArray.push(profiles.slice(i,i+size))
  }
  
  // for (let i = 0; i < chunksOfProfilesArray.length; i++) {
    //   try {
      //     if(getLocations){
  //       const log = await addLocationToProfile_v2({email: "fasonjamasi@gmail.com",password: "asdfasdf12345"},chunksOfProfilesArray[i])
  //     }
  //     if(log.includes(undefined)){
  //      // error handling
  //     } else { 
  //       const {data} = await axios.post('https://sheetdb.io/api/v1/cf80u08jsnsdk/import/json',{
  //         "json": JSON.stringify(chunksOfProfilesArray[i]),
  //       })
  //       if(data.created){
  //         logs.push(`SUCCESS at chunck ${i}`)
  //       } else {
  //         throw "Error"
  //       }
  //     }
  //   } catch (error) {
  //     logs.push(`FAILED at chunck ${i} due to ${error}`)
  //   }
  //   console.log(logs);
  // }
  // result: https://docs.google.com/spreadsheets/d/13oRvFPVTr-XSy9EuQXyEv1TiBeZ8t85CLdzPVSDxr1o/edit#gid=0
}

export default convertToCSV
