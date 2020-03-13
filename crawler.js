const fs = require('fs');
const _ = require('lodash');
const HCCrawler = require('headless-chrome-crawler');

const links = _.shuffle(fs.readFileSync('./links-update.txt').toString().split('\n'));

(async () => {
  const crawler = await HCCrawler.launch({
    maxConcurrency: 50,
    evaluatePage: () => ({
      url: window.location.href,
    }),
    onSuccess: (res) => console.log(res.result),
    obeyRobotsTxt: false,
  });
  // Queue a request with custom options
  await crawler.queue(links.filter(l => l).map(l => {
    const url = l.replace('https://thl.fi', 'https://thl.viljami.io');
    return { url,
      jQuery: false,
    };
  }));
  await crawler.onIdle(); // Resolved when no queue is left
  await crawler.close(); // Close the crawler
})();
