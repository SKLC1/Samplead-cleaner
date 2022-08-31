import axios from "axios";
import PuppeteerExtra from "puppeteer-extra";
import stealthPlugin from 'puppeteer-extra-plugin-stealth'
import useProxy from "puppeteer-page-proxy"

async function addLocationToProfile_v2(bot ,profiles) {

  const {data} = await axios.get("https://gimmeproxy.com/api/getProxy");
  
  const curl = data.curl;
  
  console.log(curl);

  PuppeteerExtra.use(stealthPlugin())
  const browser = await PuppeteerExtra.launch({
    // args: ['--proxy-server=socks5://127.0.0.1:9050'],
    headless: false,
  });
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  let error = "";

  try {
  await page.goto('https://www.linkedin.com/')
  const [button] = await page.$x('/html/body/nav/ul/li[2]/a');
  if (button) {
    await button.click();
  } else {
    error = 'stop'
  }
  } catch (error) {
    console.log(error);
  }
  
  for (let i = 0; i < profiles.length; i++) {
      try {
      const profileName = profiles[i].name.split(" ")
      await page.waitForTimeout(1000 + randomWait())
      await page.waitForSelector('[aria-label="First Name"]')
      await page.type('[aria-label="First Name"]', profileName[0],{delay: 5})
      await page.type('[aria-label="Last Name"]', profileName[1],{delay: 5})
      await page.waitForTimeout(randomWait())
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000 + randomWait())
      if (await page.$("#main-content > section > ul > li > a > div.base-search-card__info", { timeout: 5000})){
      await page.waitForSelector("#main-content > section > ul > li > a > div.base-search-card__info")
       const all_scraped_profiles = await page.$$eval("#main-content > section > ul > li > a > div.base-search-card__info", (links) => links.map((link) => {
        // if(profiles[i].job.includes()){
          return link.innerText 
        // }
       }))
       all_scraped_profiles.map(scraped_profile=>{
        if(scraped_profile.includes(profiles[i].job)){
          profiles[i].location = scraped_profile.split(/\r?\n|\r|\n/g)[3]
          profiles[i].all = scraped_profile
        }
       })
      } 
      await page.waitForSelector('[aria-label="First Name"]')
      await page.evaluate( () => document.querySelector('[aria-label="First Name"]').value = "")
      await page.evaluate( () => document.querySelector('[aria-label="Last Name"]').value = "")
      await page.waitForTimeout(1000 + randomWait())
        
      } catch (error) {
        await page.waitForSelector('[aria-label="First Name"]')
        await page.evaluate( () => document.querySelector('[aria-label="First Name"]').value = "")
        await page.evaluate( () => document.querySelector('[aria-label="Last Name"]').value = "")
        await page.waitForTimeout(1000 + randomWait())
        console.log(error);
      }
    }
  await browser.close()
}
const data = [{profileLink:"https://www.linkedin.com/in/ACoAADHJKHABz5bPaEna8puEKqRal3ApjQPJ1_I",name:"Wasay Rizwani",job:"Student at National University of Computer and Emerging Sciences",degree:"3rd+",reactionType:"like",firstName:"Wasay",lastName:"Rizwani",postUrl:"https://www.linkedin.com/feed/update/urn:li:activity:6964892177717972992",timestamp:"2022-08-16T13:56:39.470Z"},{profileLink:"https://www.linkedin.com/in/ACoAADTMkScBvBUbl6oS24z1KlyaK8FMGVgHBGM",name:"hasnain noor",job:"SEO| Digital Marketer | Link building",degree:"3rd+",reactionType:"like",firstName:"hasnain",lastName:"noor",postUrl:"https://www.linkedin.com/feed/update/urn:li:activity:6964892177717972992",timestamp:"2022-08-16T13:56:39.470Z"},{profileLink:"https://www.linkedin.com/in/ACoAADIW_BYBxAzeJ-azdT4YaqeD5h2VN6_QCmQ",name:"Musadiq Habib",job:"Wordpress developer | Intern at Plotperty | aspiring python developer",degree:"3rd+",reactionType:"like",firstName:"Musadiq",lastName:"Habib",postUrl:"https://www.linkedin.com/feed/update/urn:li:activity:6964892177717972992",timestamp:"2022-08-16T13:56:39.470Z"},{profileLink:"https://www.linkedin.com/in/ACoAADUjdh8BG2G9YC5jXvPfWf6HZboyDNCgElg",name:"Laiba Eman Aziz",job:"Student at National University of Sciences and Technology",degree:"3rd+",reactionType:"like",firstName:"Laiba",lastName:"Aziz",postUrl:"https://www.linkedin.com/feed/update/urn:li:activity:6964892177717972992",timestamp:"2022-08-16T13:56:39.470Z"},{profileLink:"https://www.linkedin.com/in/ACoAACf2Q48BqBExrsSTYqjnaheKqYEmFYukcvU",name:"Aamna Bibi",job:"SQA Engineer || Data QA || ETL Tester || MTBC CareCloud",degree:"3rd+",reactionType:"like",firstName:"Aamna",lastName:"Bibi",postUrl:"https://www.linkedin.com/feed/update/urn:li:activity:6964892177717972992",timestamp:"2022-08-16T13:56:39.470Z"},{profileLink:"https://www.linkedin.com/in/ACoAADQQ4KIBSDiWTJeCdaUuxUaE8u1mD9pE2_c",name:"Muhammad Zeeshan",job:"Network Engineer at INFOSOL TECHNOLOGIES",degree:"3rd+",reactionType:"like",firstName:"Muhammad",lastName:"Zeeshan",postUrl:"https://www.linkedin.com/feed/update/urn:li:activity:6964892177717972992",timestamp:"2022-08-16T13:56:39.470Z"},{profileLink:"https://www.linkedin.com/in/ACoAADuPcjcBa_Uo0FUDktwRYX10b6YIJT1JaJ4",name:"Nabiya Yousaf",job:"Software Engineer || Full Stack Developer || React Developer || Php Developer || Reader || Writer",degree:"3rd+",reactionType:"like",firstName:"Nabiya",lastName:"Yousaf",postUrl:"https://www.linkedin.com/feed/update/urn:li:activity:6964892177717972992",timestamp:"2022-08-16T13:56:39.470Z"},{profileLink:"https://www.linkedin.com/in/ACoAADZZevEB1YldxDvU7AYIv4f2tBCu0bfXGJs",name:"Muhammad Umer SEO",job:"Senior SEO Executive",degree:"3rd+",reactionType:"like",firstName:"Muhammad",lastName:"SEO",postUrl:"https://www.linkedin.com/feed/update/urn:li:activity:6964892177717972992",timestamp:"2022-08-16T13:56:39.470Z"},{profileLink:"https://www.linkedin.com/in/ACoAACSbjIcBq_HMEgMckYXDSDx68mPKo13pAes",name:"Abdulwahab Virk",job:"Digital Marketing Executive @mehmanpk",degree:"3rd+",reactionType:"like",firstName:"Abdulwahab",lastName:"Virk",postUrl:"https://www.linkedin.com/feed/update/urn:li:activity:6964892177717972992",timestamp:"2022-08-16T13:56:39.470Z"},{profileLink:"https://www.linkedin.com/in/ACoAAB8o5ssBmVCNnvqR-4b6zAbBXJ5EFJG0ot0",name:"Syeda Maryam Bokhari",job:"Electrical Engineer from FAST-NUCES Lahore",degree:"3rd+",reactionType:"like",firstName:"Syeda",lastName:"Bokhari",postUrl:"https://www.linkedin.com/feed/update/urn:li:activity:6964892177717972992",timestamp:"2022-08-16T13:56:39.470Z"},{profileLink:"https://www.linkedin.com/in/ACoAADl1kGsBCVEL61fNf_LMu_AEAzCiFdecWP4",name:"HAMMAD BIN NAVEED",job:"Student at University of Engineering and Technology, Taxila",degree:"3rd+",reactionType:"like",firstName:"HAMMAD",lastName:"NAVEED",postUrl:"https://www.linkedin.com/feed/update/urn:li:activity:6964892177717972992",timestamp:"2022-08-16T13:56:39.470Z"},{profileLink:"https://www.linkedin.com/in/ACoAACrp2jMB6EWFykWAxwBRvk8CUJqevD7gFgM",name:"Syed Shahzaib",job:"Spring Boot | Android | Microservice | Spring | Flutter | Node JS | Express JS",degree:"3rd+",reactionType:"like",firstName:"Syed",lastName:"Shahzaib",postUrl:"https://www.linkedin.com/feed/update/urn:li:activity:6964892177717972992",timestamp:"2022-08-16T13:56:39.470Z"},{profileLink:"https://www.linkedin.com/in/ACoAACjfbpABLvyUYRwhv_fQXSeZIQAey3lSLFc",name:"hamza nazar",job:"Software Engineer | Web designer | Frontend Developer",degree:"3rd+",reactionType:"like",firstName:"hamza",lastName:"nazar",postUrl:"https://www.linkedin.com/feed/update/urn:li:activity:6964892177717972992",timestamp:"2022-08-16T13:56:39.470Z"}]
// addLocationToProfile_v2({email: "fasonjamasi@gmail.com",password: "asdfasdf12345"} ,data)

export default addLocationToProfile_v2

function randomWait(){
  const random = Math.random() * (2000 - 500) + 500;
  console.log(random);
  return random
}
