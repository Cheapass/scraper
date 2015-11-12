'use strict';

let cheerio = require('cheerio');

function cleanTitle (str) {
  return str.replace(/<(?:.|\n)*?>/gm, '').replace(/^\s+|\s+$/g, '');
}

function getTitle ($) {
  const $title = $(
    ['#productTitle', '#btAsinTitle > span', '#btAsinTitle']
    .find(dom => $(dom).length)
  );

  const title = cleanTitle($title.text());
  return title;
}

function getPrice ($) {
  const $price = $(
    ['#priceblock_ourprice', '#priceblock_dealprice',
    '#priceblock_saleprice', '#buyingPriceValue', '#actualPriceValue',
    '#priceBlock', '#price', '#buyNewSection .offer-price']
    .find(dom => $(dom).length)
  );

  if (!$price.length) {
    return;
  }

  let price;

  if ($price.attr('id') === 'kindle_meta_binding_winner') {
    //TODO fix this. Amazon has malformed html which prevents $.find('.price')
    var matches = $price.html().match(/([0-9]+(\.[0-9]{2}))/);
    price = matches ? matches[0] : undefined;

    return price;
  }

  var priceParent = $price.find('.currencyINR').parent();
  priceParent.find('.currencyINR').remove();
  priceParent.find('.currencyINRFallback').remove();
  var priceHTML = priceParent.html();

  var priceUnformatted = priceHTML.replace(/\s/g, '').replace(/,/gi, '');
  price = priceUnformatted.indexOf('.') > 0 ? priceUnformatted.split('.')[0] : priceUnformatted;

  return price;
}

function getImage ($) {
  const $image = $(
    ['#landingImage', '#prodImage', '#kib-ma-container-0 > img', '#imgBlkFront']
    .find(dom => $(dom).length)
  );
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
