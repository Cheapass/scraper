'use strict';
'use strict';

let cheerio = require('cheerio');

function cleanTitle (str) {
  return str.replace(/^\s+|\s+$/g, '');
}

function getTitle ($) {
  const $titles = $('#productOverview [itemprop="name"]');
  const $title = $titles.length > 1 ? $($titles[0]) : $titles;
  const title = cleanTitle($title.text());
  return title;
}

function cleanPrice (str) {
  return Number(str.replace('Rs. ', '').replace(/,/g, ''));
}

function getPrice ($) {
  const $price = $('[itemprop="price"]');
  const price = cleanPrice($price.text());
  return price;
}

function getImage ($) {
  const $images = $('[itemprop="image"]');
  const $image = $images.length > 1 ? $($images[0]) : $images;
  const image = $image.attr('src');
  return image;
}

module.exports = {
  processResponse: (rawResponse) => {
    const $ = cheerio.load(rawResponse);
    return {
      title: getTitle($),
      price: getPrice($),
      image: getImage($)
    };
  }
}
