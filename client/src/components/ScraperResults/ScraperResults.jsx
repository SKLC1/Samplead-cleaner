import { Button, Checkbox, Chip, FormControlLabel } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import Link from "./Link";

function ScraperResults({links, postAgentID, eventsAgentID}) {
  const [loading, setLoading] = useState(false)
  const [savedLinks, setSavedLinks] = useState([])
  const [savedEvents, setSavedEvents] = useState([])
  const [scrapedByPhantom, setScrapedByPhantom] = useState([])
  const [containers, setContainers] = useState([])
  const [error, setError] = useState("")
  const [alreadyScraped, setAlreadyScraped] = useState("")
  const [getLocations, setGetLocations] = useState(true)

  
  async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function scrapeSavedArray(){
    setError("")
    setAlreadyScraped("")
    try {
      setLoading(true)
      for (let i = 0; i < savedLinks.length; i++) {
        const options = {
          headers: {
            "x-phantombuster-key": "K9vUBRgzdgR5Cow2AlqqcXXfOqViGUWW707kR2EIbDY",
            "Content-Type": "application/json",
          },
        }
        // 4822356083093013
        const {data} = await axios
        .post(
          "https://api.phantombuster.com/api/v2/agents/launch",
          {
            "id":`${postAgentID}`,
            "argument":{
              "csvName":"ResultsFromScraper",
              "sessionCookie":"AQEDATJxcwoEQPw_AAABgmsnZvwAAAGCjzPq_E0AdUBihukYzCegj1908EOAl9yCuuUk1e8c60ALe2BFFtGTEI8Lhv7MWXd1dM3-QfJm93pvsqOiEFC1NiVPvfpP-kJEJeb8oR03NymEnUlfWvrsmyLw",
              "postUrl":`${savedLinks[i].url}`
            }
          }, options,)
          
          console.log(data);
          await sleep(40000 + savedLinks[i].numLikes > 1500 ? 30000: 0)
          setContainers([...containers, data.containerId])
          await getProfilesData(data.containerId)
        }
      } catch (error) {
        setError(error.message)
      }
      setLoading(false)
    }
    
    async function getProfilesData(id){
    try { 
      const options = {
        method: 'GET',
        url: `https://api.phantombuster.com/api/v2/containers/fetch-result-object?id=${id}`,
        headers: {
        Accept: 'application/json',
        'X-Phantombuster-Key': 'K9vUBRgzdgR5Cow2AlqqcXXfOqViGUWW707kR2EIbDY'
        }
      };
      console.log(`https://api.phantombuster.com/api/v2/containers/fetch-result-object?id=${id}`);
      const {data} = await axios.request(options)
      const scrapedProfiles = JSON.parse(data.resultObject);
      console.log(scrapedProfiles);
      if(scrapedProfiles === null){
        setAlreadyScraped("Looks like some posts were already scraped by this agent, to get the full result please use a refreshed agent.")
        setScrapedByPhantom(scrapedByPhantom => [...scrapedByPhantom,null])
      } else {
        setScrapedByPhantom(scrapedByPhantom => [...scrapedByPhantom,...scrapedProfiles])
      }
      // setScrapedByPhantom(scrapedByPhantom.concat(scrapedProfiles))
      console.log(scrapedByPhantom);
      console.log("done");
    } catch (error) {
      console.log(error); 
    }
  }

  async function scrapeSavedEventsArray(){
    for (let i = 0; i < savedEvents.length; i++) {
      const options = {
        headers: {
          "x-phantombuster-key": "K9vUBRgzdgR5Cow2AlqqcXXfOqViGUWW707kR2EIbDY",
          "Content-Type": "application/json",
        },
      }
      
      const {data} = await axios
        .post(
          "https://api.phantombuster.com/api/v2/agents/launch",
          {
            "id":`${eventsAgentID}`,
            "argument":
            {"numberOfLinesPerLaunch":10,
            "sessionCookie":"AQEDATJxcwoEQPw_AAABgmsnZvwAAAGCjzPq_E0AdUBihukYzCegj1908EOAl9yCuuUk1e8c60ALe2BFFtGTEI8Lhv7MWXd1dM3-QfJm93pvsqOiEFC1NiVPvfpP-kJEJeb8oR03NymEnUlfWvrsmyLw",
            "queries":`${savedEvents[i]}`,
            "numberOfResultsPerEvent":1000,
            "numberOfResultsPerLaunch":100
            }
          }, options,)
      
        // console.log(data);
        await sleep(40000)
        const profilesRes = await getProfilesData(data.containerId)
        console.log(profilesRes.data);
        const scrapedProfiles = JSON.parse(profilesRes.data.resultObject);
        if("error" in scrapedProfiles){
          setAlreadyScraped("Looks like some Events were already scraped by this agent, to get the full result please use a refreshed agent.")
        }
      setScrapedByPhantom(scrapedByPhantom => [...scrapedByPhantom,...scrapedProfiles])
      }
      console.log("get profiles:");
      console.log(containers);
    
  }
  
  function renderLinks(posts){
    return posts.map((link,idx)=>{
      return <Link 
      link={link} 
      idx={idx} 
      savedLinks={savedLinks} 
      setSavedLinks={setSavedLinks} 
      key={idx}/>
      })
  }

    
    function renderKeywords(){
      return links.map((postObj)=>{
        if('events' in postObj){
          return(
            <div> 
              {renderEventLinks(postObj)}
            </div>
          )
        } else {
          return(
            <>
            <div key={postObj.keyword}>
             <h3>
              posts result for "{postObj.keyword}"
             </h3>
             <ul>
               {renderLinks(postObj.data)}
             </ul>
            </div>
          </>
        )
        }
      })
    }
    
    function renderSavedLinks(){
      return(
        <>
        <div>Saved Posts</div>
        {savedLinks.map((linkObj)=>{
          return <div key={linkObj.url + Math.random()}><a href={linkObj.url}>{linkObj.url}({linkObj.numLikes} Reactions)</a></div>
        })}
        <div>Saved Events</div>
        {savedEvents.map((link)=>{
          return <div key={link + Math.random()}><a href={link}>{link}</a></div>
        })}
        </>
        
        )
    }

    function NoLinks(){
      return(
        <div>No Links</div>
      )
    }

    function renderEventLinks(eventsObj){
      console.log(eventsObj);
      return Object.keys(eventsObj.events).map((keyName,i)=>{
        return(
          <div key={i}>
             <h4>{keyName} events</h4>
             <ul>
               {eventsObj.events[keyName].map((link,idx)=>{
                return <li key={idx}>
                  <a href={link}>{link}</a>
                   <Button onClick={(e)=>setSavedEvents([...savedEvents, link])}>SAVE</Button>
                </li>
               })}
             </ul>
          </div>
        )
      })
    }

    function savedReset(){
      setScrapedByPhantom([])
      setSavedLinks([])
      setSavedEvents([])
    }

    async function createCSV(){
      console.log(scrapedByPhantom);
      try {
       setError('')
       const baseURL = "http://localhost:5000";
       setLoading(true)
       const {data} = await axios.post(`${baseURL}/resume/csv`,{scrapedByPhantom, getLocations})
       console.log(data);
       setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }

    async function createCSVofLinks(){
      console.log(links);
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
        console.log(chunksOfProfilesArray[i]);
        const {data} = await axios.post('https://sheetdb.io/api/v1/iakojl01kdc99/import/json',{
          "json": JSON.stringify(chunksOfProfilesArray[i]),
        })
        console.log(data);
      }
    }
    
    return ( 
    <>
    <div className="container">
     <h2>RESULTS</h2>
     <div className="container">
        {links.length > 0?renderKeywords():<NoLinks/>}
     </div>
     <h2>SAVED</h2>
     {renderSavedLinks()}
      <Button onClick={createCSVofLinks}>CSV of links</Button>
     { <Button onClick={scrapeSavedArray}>Get Profiles From Posts</Button>}
     { <Button onClick={scrapeSavedEventsArray}>Get Profiles From Events</Button>}
     {savedEvents.length > 0 && <p>NOTE: that these event must be manually registered to by the scraper bot account.</p>}
     {loading && <DotLoader/>}
     {error && <div><p>{error}</p> Please Make sure Agent ID is correct or use a new one</div>}
     {<Button onClick={()=>savedReset()}>Reset</Button>}
    </div>
    {scrapedByPhantom.length > 0 &&
     <div className="container">
      <p>{scrapedByPhantom.length} results</p>
      <div className="input-wrapper">
        {alreadyScraped}
       <Button onClick={createCSV}>Add to CSV</Button>
        {/* <a href="https://docs.google.com/spreadsheets/d/13oRvFPVTr-XSy9EuQXyEv1TiBeZ8t85CLdzPVSDxr1o/edit#gid=0">Results, </a> */}
        <a href="https://docs.google.com/spreadsheets/d/1wmJ8lWwl3znr6dYC1tM1MRhjlHgZJsUnk-7PiMS6bB4/edit#gid=0">CSV Results</a>
      {/* <FormControlLabel control={<Checkbox defaultChecked onChange={()=>setGetLocations(!getLocations)} />} label="Add Locations" /> */}
      </div>
    </div>}
    </>
   );
}

export default ScraperResults;