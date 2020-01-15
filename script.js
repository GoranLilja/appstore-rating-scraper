require('dotenv').config()
const puppeteer = require('puppeteer')

const appIdArg = process.argv.filter((arg => arg.length === 9 && parseInt(arg)))[0]
const countryArg = process.argv.filter((arg => arg.length === 2))[0]
const appIdEnv = process.env.APP_ID
const countryEnv = process.env.COUNTRY

const appId = appIdArg ? appIdArg : appIdEnv
const country = countryArg ? countryArg : countryEnv

if (appId == null || appId === '' || country == null || country === '') {
    console.error(`You need to specify APPID and COUNTRY.`)
    return -1
}

const url = `https://apps.apple.com/${country}/app/id${appId}?l=en`
const elementSelector = '.we-customer-ratings__averages__display'

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
        const rating = await scrapeElement(url, elementSelector)
        console.log(rating)
    }
    catch(err) {
        console.error(err)
    }
}

getRating()