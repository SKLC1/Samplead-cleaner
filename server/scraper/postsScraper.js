
import puppeteer from 'puppeteer'


//bots
const user1 = {email: "tamirgalim@gmail.com",password: "asdfasdf12345"}; 
const user2 = {email: "ukd5880@gmail.com",password: ")x-B=MV_X%dtw3="}; // banned
const user3 = {email: "davidglaritz@gmail.com",password: "David5101!"};
const user4 = {email: "fasonjamasi@gmail.com",password: "asdfasdf12345"}; 


async function scrapePostsV2(bot, userConfig, iteration){
  let data = []; 
  let finalData = []; 
  let done = false;
  const desiredAmountOfLinks = userConfig.config.scrollCount

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  
  async function openLinkedIn(browser,page,bot, { config }, category) {
    console.log(config);
  try {
  await page.goto('https://www.linkedin.com/')
  // login
  await page.click(".nav__button-secondary")
  await page.waitForTimeout(1000 + randomWait());
  await page.type("#username",bot.email,{delay: 15})
  await page.type("#password",bot.password,{delay: 15})
  await page.waitForTimeout(1000 + randomWait());
  await page.click(".btn__primary--large")
  await page.waitForTimeout(5000 + randomWait());
   getRawData(page,browser,config)
   } catch(error) {
    throw error
   }
  }
  async function getRawData(page,browser,config){
    for (let i = 0; i < config.keywords.length; i++) {
      await page.goto(`https://www.linkedin.com/search/results/content/?datePosted=%22past-week%22&keywords=${config.keywords[i]}&origin=FACETED_SEARCH&sid=(s%40`)
      await captureResponse(page,browser,config, config.keywords[i])
      if(i + 1 === config.keywords.length){
        console.log(i + 1);
        done = true
      }
    }
  }

  async function captureResponse(page,browser,config, currentKeyword){
  
    await page.on('response', async (response)=> {    
      if (response.url().includes('SearchClusterCollection')){
        // console.log("response code: ", response.status());
        const data = await response.json();
        if(response.status() === 200){
          getRelevantPostURN(data, config)
        } else {
          console.log('error while getting data');
        }
      } 
    });
    for (let i = 0; i <= 15; i++) {
        await page.waitForTimeout(3000);
        await loadMoreData(page)
      if(data.length > config.scrollCount){
        console.log(`DATA FOR ${currentKeyword}: ${data}`);
        returnDataOnEnd(currentKeyword, data)
        return;
      }
    }
  
  }
  
  async function returnDataOnEnd(keyword,resData){
    console.log('SCRAPING COMPLETE');
    finalData.push({keyword: keyword, data: resData.slice(0, desiredAmountOfLinks)})
    data = []
  }
  
  async function loadMoreData(page){
    //scroll down
    await page.evaluate(() => new Promise((resolve) => {
      var scrollTop = -1;
      const interval = setInterval(() => {
        window.scrollBy(0, 100);
        if(document.documentElement.scrollTop !== scrollTop) {
          scrollTop = document.documentElement.scrollTop;
          return;
        }
        clearInterval(interval);
        resolve();
      }, 10);
    }));
  }
  
  function getRelevantPostURN(data, config){
    const all_posts = data.included;
    const relevant_posts = []
    const accepted_posts_refs = []
    all_posts.forEach((post)=>{
      if("numLikes" in post){
        relevant_posts.push(post);
      } 
    })
    relevant_posts.forEach((post)=>{
      if(post.numLikes >= config.threshold){
        accepted_posts_refs.push({urn: post.entityUrn, numLikes: post.numLikes})
      }
    })
    convertURNtoLink(accepted_posts_refs)
    console.log(`${accepted_posts_refs.length} posts accepted out of ${relevant_posts.length} relevant posts`);
  }
  
  function convertURNtoLink(arrOfURN){
    const baseURL = 'https://www.linkedin.com/feed/update/';
    if(arrOfURN.length > 0 ){
      const links = arrOfURN.map(postObj =>{
        const relevantURN = postObj.urn.split('Counts:')
        return {url:`${baseURL}${relevantURN[1]}`, numLikes: postObj.numLikes ,saved: false}
      })
      // console.log('ACCEPTED LINKS:');
      // console.log(links);
      data = data.concat(links);
    } else {
      console.log('no relevant posts found') 
    }
  }
  
  openLinkedIn(browser, page, user4, userConfig)

  const waitUntil = (condition) => {
   return new Promise((resolve) => {
      let interval = setInterval(() => {
          if (!condition()) {
            return
          }

          clearInterval(interval)
          resolve()
      }, 100)
   })
  }

  await waitUntil(() => done)
  await browser.close()
  return finalData
}

function randomWait(){
  const random = Math.random() * (2000 - 500) + 500;
  console.log(random);
  return random
}

export default scrapePostsV2

