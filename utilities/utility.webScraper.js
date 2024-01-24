import puppeteer from 'puppeteer';

const basePokedexURL = 'https://supeffective.com';
const pokedexListPath = '/#/pokedex/national/home';

export const getPokemonNameAndImage = async (nationalPokedexNumber) => {
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
   await page.goto(basePokedexURL + pokedexListPath, {
      waitUntil: 'networkidle0'
   });

   // Click on buttons excluding additional pokemon forms and compact grid to load more assets at a time
   await page.evaluate(() => {
      document.querySelector('button[title="Toggle Forms"]').click();
      document.querySelector('button[title="Toggle Compact mode"]').click();
      return;
   });

   // Wait for the additional assets to fully load
   await page.waitForNetworkIdle();

   // Store the scraped data when target is found
   let targetPokemon;

   // Keep track of how many pokemon listings are loaded
   let pokedexCount = 0;

   // Keep track of scrolling to terminate loop if end of page has been reached
   let prevScrollHeight = 0;
   let currScrollHeight = 0;

   // Loop to keep on scrolling down the page until the target pokemon is loaded
   while (nationalPokedexNumber > pokedexCount) {
      // Get how many pokemon are loaded
      pokedexCount = await page.evaluate(() => {
         return [...document.querySelectorAll('[class^="_entryWrapper"]')].length;
      });

      // Store target pokemon data if it has been loaded
      if (nationalPokedexNumber <= pokedexCount) {
         targetPokemon = await page.evaluate((index) => {
            const entry = [...document.querySelectorAll('[class^="_entryWrapper"]')][index];
            const name = entry.querySelector('[class^="_entryName"]').innerHTML;
            const imagePath = entry.querySelector('picture > source:not(:first-child)').srcset;

            return { name, imagePath };

         }, nationalPokedexNumber - 1);

         break;
      };

      // If the target pokemon is not loaded, scroll down the page
      currScrollHeight = await page.evaluate(() => {
         document.getElementsByTagName('footer')[0].scrollIntoView();

         return document.body.scrollHeight;
      });

      // Wait for the additional assets to fully load
      await page.waitForNetworkIdle();

      // If the end of the page has been reached, set targetPokemon to null as a failed search, else, update scroll height and loop again
      if (prevScrollHeight === currScrollHeight) {
         targetPokemon = null;
         break;
      }
      else {
         prevScrollHeight = currScrollHeight;
      };
   };

   await browser.close();

   return targetPokemon;
};