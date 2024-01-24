import puppeteer from 'puppeteer';

const basePokedexURL = 'https://supeffective.com';
const pokedexListPath = '/#/pokedex/national/home';

const autoScroll = async (page) => {
   await page.evaluate(async () => {
      const footer = document.getElementsByTagName('footer')[0];

      await new Promise((resolve) => {
         let counter = 0;

         let intervalId = setInterval(() => {
            footer.scrollIntoView();
            counter++;

            if (counter > 20) {
               clearInterval(intervalId);
               resolve();
            }
         }, 250);
      });
   });
};

const getPokedexData = async (nationalPokedexNumber) => {
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

   // page.waitForSelector('button[title="Toggle Forms"]');

   // Evaluate the page and get the data needed

   await page.evaluate(() => {
      document.querySelector('button[title="Toggle Forms"]').click();
      document.querySelector('button[title="Toggle Compact mode"]').click();
      return;
   });

   await page.waitForNetworkIdle();

   let listLength = 0;
   let counter = 0;

   while (nationalPokedexNumber > listLength) {
      console.time('grabber')
      counter++;

      listLength = await page.evaluate(() => {
         return [...document.querySelectorAll('[class^="_entryWrapper"]')].length;
      });

      console.log(`entries loaded: ${listLength}`);

      if (nationalPokedexNumber <= listLength) {
         const pokemon = await page.evaluate((index) => {
            const entry = [...document.querySelectorAll('[class^="_entryWrapper"]')][index];
            const name = entry.querySelector('[class^="_entryName"]').innerHTML;
            const imagePath = entry.querySelector('picture > source:not(:first-child)').srcset;

            return { name, imagePath };

         }, nationalPokedexNumber - 1);

         console.timeEnd('grabber')
         return console.log(pokemon);
      };

      await page.evaluate((counter) => {
         const footer = document.getElementsByTagName('footer')[0];
         footer.scrollIntoView();
         return console.log(`scrolling ${counter}x`)
      }, counter);

      await page.waitForNetworkIdle();

      console.log('network idle');

      // fail-safe
      if (counter > 100) {
         console.log('break safe');
         break;
      }
   };

   console.log('loop done')

   // listLength = await page.evaluate(() => {
   //    const entries = [...document.querySelectorAll('[class^="_entryWrapper"]')];

   //    return entries.length;
   // });

   // console.log(listLength);

   // if (nationalPokedexNumber > listLength) {
   //    await page.evaluate(() => {
   //       const footer = document.getElementsByTagName('footer')[0];
   //       footer.scrollIntoView();

   //       return;
   //    });

   //    await page.waitForNetworkIdle();

   //    listLength = await page.evaluate(() => {
   //       const entries = [...document.querySelectorAll('[class^="_entryWrapper"]')];

   //       return entries.length;
   //    });

   //    return console.log(listLength);


   // };

   // const pokemon = await page.evaluate(async ({ thisPage, nationalPokedexNumber }) => {
   //    const footer = document.getElementsByTagName('footer')[0];
   //    const entries = [...document.querySelectorAll('[class^="_entryWrapper"]')];

   //    console.log(entries.length);

   //    if (nationalPokedexNumber <= entries.length) {
   //       const entry = entries[nationalPokedexNumber - 1];
   //       const name = entry.querySelector('[class^="_entryName"]').innerHTML;
   //       const imagePath = entry.querySelector('picture > source:not(:first-child)').srcset;

   //       return { name, imagePath };
   //    }
   //    else {
   //       footer.scrollIntoView();
   //       await thisPage.waitForNetworkIdle();
   //       return console.log([...document.querySelectorAll('[class^="_entryWrapper"]')]);
   //    };


   // }, { thisPage: page, nationalPokedexNumber });

   // console.log(pokemon);
   return;
   // await browser.close();
};

getPokedexData(1025);