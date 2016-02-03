'use strict';

let cheerio = require('cheerio');

function cleanTitle (str) {
  return str.replace(/^\s+|\s+$/g, '');
}

function getTitle ($) {
  const $titles = $('[itemprop="name"]');
  const $title = $titles.length > 1 ? $($titles[0]) : $titles;
  const title = cleanTitle($title.text());

  const $subtitles = $('.subtitle');
  const $subtitle = $subtitles.length > 1 ? $($subtitles[0]) : $subtitles;
  const subtitle = $subtitle.length ? cleanTitle($subtitle.text()) : '';
  if (!$subtitle.length) {
    return title;
  }
  return `${title} ${subtitle}`;
}

function cleanPrice (str) {
  return Number(str.replace('Rs. ', '').replace(/,/g, ''));
}

function getPrice ($) {
  const $price = $('.pricing .selling-price');
  const price = cleanPrice($price.html());
  return price;
}

function getImage ($) {
  const $images = $('.productImages .productImage');
  const $image = $images.length > 1 ? $($images[0]) : $images;
  const image = $image.data('src');
  return image;
}

function getCategory ($) {
  const $category = $('.product-details .fk-hidden [name="vertical"]');
  return $category.length ? $category.attr('value') : null;
}

function getStyleCode ($) {
  let styleCode;
  $('.specsKey').each((index, specKey) => {
    if ($(specKey).html() === 'Style Code') {
      styleCode = $(specKey).siblings('.specsValue').html().trim();
      return;
    }
  });

  return styleCode;
}

module.exports = {
  processResponse: (rawResponse) => {
    const $ = cheerio.load(rawResponse);
    return {
      title: getTitle($),
      price: getPrice($),
      image: getImage($),
      category: getCategory($),
      styleCode: getStyleCode($)
    };
  }
}
