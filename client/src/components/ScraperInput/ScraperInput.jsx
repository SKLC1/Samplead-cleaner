import { Button, Checkbox, Chip, FormControlLabel, TextField, Typography } from '@mui/material';
import Slider from '@mui/material/Slider';
import { useState } from 'react';


function ScraperInput({getScrapedData, error, setPostAgentID, setEventsAgentID}) {
  const [keywords, setKeywords] = useState(['cyber'])
  const [threshold, setThreshold] = useState(50)
  const [scrollCount, setScrollCount] = useState(10)
  const [getEvents, setGetEvents] = useState(true)

  
  function handleDelete(value){
    console.log(value);
    const newKeywords = keywords.filter(e=> e !== value)
    console.log(newKeywords);
    setKeywords(newKeywords)
  }

  function addTags(e){
    if(e.key === "Enter"){
      setKeywords([...keywords, e.target.value])
    } 
  }
 
  function renderTags(){
    return keywords.map((tag,idx)=>{
      return (
        <Chip key={idx} label={tag} onDelete={()=>handleDelete(tag)}/>
      )
    })
  }

  return ( 
    <>
    <div className='container'>
     <Typography gutterBottom>
        Posts Agent ID
      </Typography>
        <input onChange={(e)=>setPostAgentID(e.target.value)} placeholder='Posts Agent ID'/>
     <Typography gutterBottom>
        Events Agent ID
      </Typography>
        <input onChange={(e)=>setEventsAgentID(e.target.value)} placeholder='Events Agent ID'/>
     <div className={error?"error-wrapper":'input-wrapper'}>
     <Typography id="input-slider" gutterBottom>
        Keywords
      </Typography>
       <div className='tag-input'>
        <ul>
          {renderTags()}
        </ul>
        <input onKeyUp={(e)=>addTags(e)} placeholder='Add tag'/>
       </div>
      <Typography id="input-slider" gutterBottom>
        Like Threshold
      </Typography>
      <Slider defaultValue={50} onChange={(e)=>setThreshold(e.target.value)} valueLabelDisplay="auto"  />
      <Typography id="input-slider" gutterBottom>
        Search Size
      </Typography>
      <Slider defaultValue={10} max={30} onChange={(e)=>setScrollCount(e.target.value)} valueLabelDisplay="auto"  />
      <FormControlLabel control={<Checkbox defaultChecked onChange={()=>setGetEvents(!getEvents)} />} label="Get Events" />
      <div className='display-config'>
       <ul>Keywords: {keywords.length === 0?
       <div>None</div>:
       keywords.map((word)=><li>{word}</li>)}
       </ul>
       <div>Like Threshold: {threshold}</div>
       <div>Search Size: {scrollCount}</div>
      </div>
     <Button onClick={()=>getScrapedData({keywords,threshold,scrollCount,getEvents})}>Generate</Button>
      <h3 className='error-message'>{error.message}</h3>
     </div>
    </div>
    </>
   );
}

export default ScraperInput;