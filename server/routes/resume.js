import { config } from 'dotenv'
import express from 'express'
import convertToCSV from '../scraper/createCSV.js'
import scrapeEvents from '../scraper/eventsScraper.js'
import scrapePostsV2 from '../scraper/postsScraper.js'
export const resumeRouter = express.Router()

resumeRouter.post('/scrape', async (req,res)=>{
  try {
    const scrapeResult = await scrapePostsV2({email: "tamirgalim@gmail.com",password: "asdfasdf12345"}, req.body)
    if(req.body.config.getEvents){
     const resEvents = await scrapeEvents({email: "tamirgalim@gmail.com",password: "asdfasdf12345"}, req.body)
     scrapeResult.push({events: resEvents})
    }
    console.log(`SCRAPE RES: ${scrapeResult}`);
    res.json(scrapeResult)
  } catch (error) {
    res.json({message: error.message})
  }
})

resumeRouter.post('/attend', async (req,res)=>{
  try {
    const res = await registerToEvents({email: "tamirgalim@gmail.com",password: "asdfasdf12345"}, req.body.eventLinks)
    res.json(res)
  } catch (error) {
    res.json({message: error.message})
  }
})

resumeRouter.post('/csv', async (req,res)=>{
  console.log(req.body.scrapedByPhantom.length);
  try {
    const res = await convertToCSV(req.body.scrapedByPhantom, req.body.getLocations)
    console.log(res);
    res.json(res)
  } catch (error) {
    res.json({message: error.message})
  }
})

