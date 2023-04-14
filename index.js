const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/', async (req, res) => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('https://www.meetup.com/pt-BR/rocketseat/events/');

  const elements = await page.$$('li.list-item');
  const data = [];

  for (const element of elements) {
    const title = await element.$eval('h2 a', node => node.innerText);
    const date = await element.$eval('time', node => node.innerText);
    const location = await element.$eval('div.venueDisplay', node => node.innerText);
    const images = await element.$$eval('span.eventCardHead--photo', nodes => nodes.map(node => node.style.backgroundImage.match(/url\("(.+)"\)/)[1]));
    const link = await element.$eval('a.eventCard--link', node => node.href);

    data.push({ title, date, location, images, link });
  }

  res.json(data);

  await browser.close();
});

app.listen(process.env.PORT || 3000, () => console.log('Server running'));
