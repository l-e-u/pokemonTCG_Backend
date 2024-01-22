import puppeteer from 'puppeteer';

const websiteURL = 'https://www.serebii.net/pokemon/';
const pokemonName = 'Rattata';

// Selector targets all rows that are not first (first row are column headers)
const cssQuerySelectorPattern = 'table.roundy > tbody > tr:not(:first-child)';

// Selector targets the pokemon artwork
const artworkCssQuerySelector = '#sprite-regular'

// Start a Puppeteer session
const browser = await puppeteer.launch({
   // set 'headless: false' to have a visible browser for easier debugging
   headless: false,
   // - no default viewport ('defaultViewport: null' - website page will in full width and height)
   defaultViewport: null
});

// Open a new page
const [page] = await browser.pages();

// On this new page:
// - open the target website
// - wait until the DOM content is loaded (HTML is ready)
await page.goto(websiteURL + pokemonName.toLowerCase(), {
   waitUntil: 'domcontentloaded'
});