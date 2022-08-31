import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { resumeRouter } from './routes/resume.js'
import cors from 'cors'
import bodyParser from 'body-parser';
import scrapePostsV2 from './scraper/postsScraper.js'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;
//server
if(process.env.NODE_ENV){
  app.use(express.static('../client/build'))
  app.get('*',(req ,res)=>{
    res.sendFile(path.resolve('../client', 'build', "index.html"))
  })
}

// mongoose.connect('mongodb://0.0.0.0:27017/resumeme',{useNewUrlParser: true})
// const db = mongoose.connection;
// db.on('error', (error)=> console.log(error))
// db.once('open', ()=> console.log('Connected to db'))

app.use(cors())
// app.use(bodyParser.json())
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use('/resume', resumeRouter)

app.use(extendTimeoutMiddleware)

app.listen(PORT,()=>{
  console.log(`server running on ${PORT}`);
});
 