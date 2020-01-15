require('dotenv').config()
const puppeteer = require('puppeteer')

const appId = process.env.APP_ID
const country = process.env.COUNTRY

if (appId == null || appId === '' || country == null || country === '') {
    console.error(`You need to specify APPID and COUNTRY.`)
    return -1
}

const url = `https://apps.apple.com/${country}/app/id${appId}?l=en`
const elementSelector = '.star-rating__count'

async function scrapeElement(url, elementSelector) {
    let browser
    try {
        browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(url)

        const el = await page.$(elementSelector)
        const textContent = await el.getProperty('textContent')
        return textContent.jsonValue()
    }
    catch(err) {
        console.error(err)
    }
    finally {
        browser.close()
    }
}

async function getRating() {
    try {
        const text = await scrapeElement(url, elementSelector)
        const rating = text.split(',')[0]

        console.log(rating)
    }
    catch(err) {
        console.error(err)
    }
}

getRating()