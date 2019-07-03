const puppeteer = require('puppeteer');
const CREDS = require('./constants');
const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');

const creds2 = require('./client_secret.json');
setInterval(function () {
  let scrape = async () => {
    const chromeOptions = {
    headless:false,
    defaultViewport: null,
    slowMo:10,
  };
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    const browser = await puppeteer.launch(chromeOptions);
    const page = await browser.newPage();
    await page.setViewport({width: 1200, height: 720})
    await page.goto('https://myaccount.nytimes.com/oauth/google-link?type=login&flow=UL&auth_token=H4sIAAAAAAAAA52Py27CMBBF%2F8XriBgc%2FMge1GWFWEaKHM%2BYWpjYsk1ToPx7E7rputszM%2BfeeRDjHY7FAWnJSV8wk4qAy9HrG2mt9hkrkjDHMGbsyy3ivGdCODskywBcQlP6a3Iz%2Fygl5raru3qaptV4K272rUy4dHW83u8ec1d71IBpCDrBEmXcK9leve%2BjPi3Sks6kfRAdo3dGFxfGJTKFnKfwe6RzxjLDP66Zvh2P7%2F1ht98ddof%2FlHlWBL%2Fi%2FE8m7XrL142SnKuKxM9XRUBpOQhUuGlkA2veUIpMKWEp2C1S8vxuNGNCKWOshK2kA2fUMM0BLJfcUDVoAQY3Ao1BSUFoxiVYNjCu6IYO4gesQsaNjQEAAA%3D%3D', { waitUntil: 'networkidle2' }); // wait until page load
    await page.type('#identifierId', CREDS.username);
    // click and wait for navigation
    await Promise.all([
              page.click('.ZFr60d'),
              page.waitForNavigation({ waitUntil: 'networkidle2' })

    ]);
    await sleep(2000);
    await page.type('.whsOnd.zHQkBf', CREDS.password);
    await Promise.all([
              page.click('.ZFr60d'),
              page.waitForNavigation({ waitUntil: 'networkidle2' })

    ]);

  await page.screenshot({path: 'google.png'});

  const result = await page.evaluate(() => {
      let date = document.querySelector('.lbd-type__date').innerText;
      let score1 = {name: document.querySelector('.lbd-board__items > .lbd-score:nth-child(1) > .lbd-score__name').innerText, time: document.querySelector('.lbd-board__items > .lbd-score:nth-child(1) > .lbd-score__time').innerText };
      let score2 = {name: document.querySelector('.lbd-board__items > .lbd-score:nth-child(2) > .lbd-score__name').innerText, time: document.querySelector('.lbd-board__items > .lbd-score:nth-child(2) > .lbd-score__time').innerText };
      let score3 = {name: document.querySelector('.lbd-board__items > .lbd-score:nth-child(3) > .lbd-score__name').innerText, time: document.querySelector('.lbd-board__items > .lbd-score:nth-child(3) > .lbd-score__time').innerText };
      let score4 = {name: document.querySelector('.lbd-board__items > .lbd-score:nth-child(4) > .lbd-score__name').innerText, time: document.querySelector('.lbd-board__items > .lbd-score:nth-child(4) > .lbd-score__time').innerText };
      let score5 = {name: document.querySelector('.lbd-board__items > .lbd-score:nth-child(5) > .lbd-score__name').innerText, time: document.querySelector('.lbd-board__items > .lbd-score:nth-child(5) > .lbd-score__time').innerText };
      let score6 = {name: document.querySelector('.lbd-board__items > .lbd-score:nth-child(6) > .lbd-score__name').innerText, time: document.querySelector('.lbd-board__items > .lbd-score:nth-child(6) > .lbd-score__time').innerText };

      let scores = [];
      scores.push(score1, score2, score3, score4, score5, score6);
      return {
          date,
          scores
      }
  });

  browser.close();
  return result;

  }

  scrape().then((value) => {
    async function accessSpreadsheet() {
  const doc = new GoogleSpreadsheet('130KvO8EAqX-rFq6ayB7y7x2XKMROfzIdJcKomzP_2Lo');
  await promisify(doc.useServiceAccountAuth)(creds2);
  const info = await promisify(doc.getInfo)();
  const sheet = info.worksheets[0];
  const rows = await promisify(sheet.getRows)({
    offset:1
  });
  let d = new Date(value.date);
  let dayOfMonth = d.getDate();

   let num = dayOfMonth - 1;
   let num2 = dayOfMonth;
   let row = rows[num];

   console.log(value);

   for (i = 0; i < value.scores.length; i++) {
     if (value.scores[i].name == "Sir Crossword Witch") {
       if (value.scores[i].time != "--") {
         row.caroline = value.scores[i].time;
         row.save();
       }
     } else if (value.scores[i].name == "Best Boy (you)") {
        if (value.scores[i].time != "--") {
          row.matt = value.scores[i].time;
          row.save();
        }
     } else if (value.scores[i].name == "Princess Side Shit") {
        if (value.scores[i].time != "--") {
         row.kinga = value.scores[i].time;
         row.save();
       }
     } else if (value.scores[i].name == "Mr Big") {
       if (value.scores[i].time != "--") {
         row.audrey = value.scores[i].time;
         row.save();
       }

     } else if (value.scores[i].name == "Kris Kross") {
       if (value.scores[i].time != "--") {
         row.kitty = value.scores[i].time;
         row.save();
       }

     }  else if (value.scores[i].name == "Granny Wordsmith") {
       if (value.scores[i].time != "--") {
         row.viv = value.scores[i].time;
         row.save();
       }

     }

     function sleep(ms) {
       return new Promise(resolve => setTimeout(resolve, ms));
     }
       await sleep(1000);
    }
   }

  accessSpreadsheet();

  });
}, 60 * 120 * 1000); // 2 hour
