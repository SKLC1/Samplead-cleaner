
import puppeteer from 'puppeteer'

//bots
const user1 = {email: "tamirgalim@gmail.com",password: "asdfasdf12345"};
const user2 = {email: "ukd5880@gmail.com",password: ")x-B=MV_X%dtw3="};
const user3 = {email: "davidglaritz@gmail.com",password: "David5101!"};


async function scrapeEvents(bot, userConfig, iteration){
  
  let data = []; 
  let done = false;
  const eventLinks = {}
  const desiredAmountOfLinks = userConfig.config.scrollCount

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768});

  
  async function openLinkedIn(browser, page, bot, { config }, category) {
    // config.keywords.push("tester")
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
  // search for desired title
  for (let i = 0; i < config.keywords.length + 1; i++) {  
    if(i + 1 > config.keywords.length){
      await page.waitForTimeout(2000 + randomWait());
      done = true
      return;
    }
    //delete last input 
    page.waitForSelector('.search-global-typeahead__input', {visible: true})
    await page.evaluate( () => document.querySelector(".search-global-typeahead__input").value = "")
    //write keyword
    page.waitForSelector('.search-global-typeahead__input', {visible: true})
    await page.type(".search-global-typeahead__input",`${config.keywords[i]}`,{delay: 15})
    await page.keyboard.press('Enter');
    // insert keyword
    await page.waitForTimeout(4000 + randomWait());
    page.waitForSelector("#search-reusables__filters-bar > ul > li", {visible: true})
    const buttons = await page.$$("#search-reusables__filters-bar > ul > li")
    for (const li of buttons) {
      let value = await page.evaluate(el => el.textContent, li)
      if(value.includes('Events')){
        await li.click()
      }
    }
    // await page.goto(`https://www.linkedin.com/search/results/events/?keywords=${config.keywords[i]}&origin=SWITCH_SEARCH_VERTICAL&sid=qVl`)
    await captureResponse(page,browser,config, config.keywords[i])
    
  }
    
  } catch (error) {
     throw error  
  }
}

async function captureResponse(page,browser,config, keyword){
  await page.on('response', async (response)=> {
    if (response.url().includes('clusters?decorationId')){
      console.log("response code: ", response.status());
      const data = await response.json();
      if(response.status() === 200){
        console.log(data);
        const relevantData = data.included
        const links = []
        for (let i = 0; i < 9; i++) {
          const eventNumber = relevantData[i].entityUrn.split(":")[3]
          const link = `https://www.linkedin.com/events/${eventNumber}/`
          links.push(link)
        }
        eventLinks[keyword] = links;
      } else {
        console.log('error while getting data');
      }
    } 
  });
}
 
openLinkedIn(browser, page, user1, userConfig, "Posts")

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
 return eventLinks
}

// scrapeEvents({email: "fasonjamasi@gmail.com",password: "asdfasdf12345"},
// { config: {threshold: 0, scrollCount: 5, keywords: ['cyber','hiring']}}, 0)

function randomWait(){
  const random = Math.random() * (2000 - 500) + 500;
  console.log(random);
  return random
}

export default scrapeEvents