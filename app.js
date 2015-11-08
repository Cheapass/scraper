'use strict';

let request = require('request');
let express = require('express');
let app = express();
let lodash = require('lodash');

let merge = lodash.merge;

let utils = require('./src/utils');
// let flipkart = require('./src/sites/flipkart.com');
// let snapdeal = require('./src/sites/snapdeal.com');

function handleScrape (req, res) {
  const url = req.query.url;
  const site = req.query.site;

  const requestPayload = {
    url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.94 Safari/537.36'
    }
  };

  request(requestPayload, (err, response, body) => {
    const statusCode = response.statusCode;
    if (!(statusCode >= 200 && statusCode < 300)) {
      return res.status(500).json({
        error: 'Error processing supplied URL'
      });
    }

    res.json({[site]: merge({ url }, require(`./src/sites/${site}.com`)['processResponse'](body))});
  });
};

app.use('/scrape', (req, res, next) => {
  const url = req.query.url;
  const site = req.query.site;

  if (!url) {
    return res.status(400).json({
      error: 'URL is missing'
    });
  }

  if (!utils.isURL(url)) {
    return res.status(400).json({
      error: 'URL is invalid or malformed'
    });
  }

  if (!utils.isSiteSupported(site)) {
    return res.status(403).json({
      error: 'Website not supported'
    });
  }

  next();
});

app.get('/scrape', handleScrape);

app.listen(6100);

console.log('scraper running on http://localhost:6100. Use Route /scrape');
