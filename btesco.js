const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const { Tabletojson: tabletojson } = require('tabletojson');

const getSearchResultsPage = async (search, page = 1) => {
  const safeSearch = encodeURIComponent(search);
  try {
    const { data } = await axios.get(`https://www.tesco.com/groceries/en-GB/search?query=${safeSearch}&page=${page}`, {
      responseType: 'document',
    });
    return data;
  } catch (err) {
    console.error(err);
    return;
  }
};

const getProductPage = async (url) => {
  try {
    const { data } = await axios.get(url, {
      responseType: 'document',
    });
    return data;
  } catch (err) {
    console.error(err);
    return;
  }
};

const getUnit = (text) => {
  if (text.endsWith('g')) {
    return 'g';
  } else if (text.endsWith('ml')) {
    return 'ml';
  } else if (text.endsWith('each')) {
    return '1';
  } else if (text.endsWith('litre')) {
    return 'l';
  }
};

const getCategory = ($) => {
  let categories = [];
  $('a.beans-breadcrumb__list-item-link').each(function () {
    categories.push($(this).text());
  });

  categories = categories.filter((category) => !!category);

  return categories[categories.length - 1];
};

const getQuantity = (text) => {
  const matchers = [/(\d*\.?\d*)\s*(m?g)/gi, /(\d+)\s*(kcal)/gi, /\/(\d+)(\w)/gi];
  let output = {};

  matchers.some((matcher) => {
    const matched = matcher.exec(text);

    if (matched) {
      output = {
        quantity: Number(matched[1]),
        unit: matched[2],
      };
      return true;
    }
  });
  return output;
};

const getNutrition = ($) => {
  const nutritionTable = $('table.product__info-table').parent().html();
  const [nutritionArray] = tabletojson.convert(nutritionTable);

  const cols = Object.keys(nutritionArray[0]);
  const nutrition = nutritionArray.reduce((obj, el) => {
    for (let i = 1; i < cols.length; i++) {
      const colName = cols[i];
      const macro = el[cols[0]].trim().toLowerCase();
      const value = el[colName].trim().toLowerCase();

      const { quantity, unit } = getQuantity(value);

      if (quantity) {
        obj[colName.toLowerCase()] = {
          ...obj[colName.toLowerCase()],
          [macro]: {
            quantity,
            unit,
          },
        };
      }
    }

    return obj;
  }, {});

  return nutrition;
};

const searchProducts = async (search) => {
  const page = await getSearchResultsPage(search);
  const $ = cheerio.load(page);

  const products = [];

  $('li.product-list--list-item').each(function () {
    const anchor = $(this).find('a[data-auto=product-tile--title]');
    const { quantity, unit } = getQuantity($(this).find('.price-per-quantity-weight span.weight').text());

    products.push({
      name: anchor.text(),
      url: `https://www.tesco.com${anchor.attr('href')}`,
      image: $(this).find('img.product-image').attr('src'),
      price: Number($(this).find('.price-per-sellable-unit span[data-auto=price-value]').text()),
      refPrice: Number($(this).find('.price-per-quantity-weight span[data-auto=price-value]').text()),
      refQuantity: quantity,
      refUnit: unit,
    });
  });

  return products;
};

const getProduct = async (url) => {
  const page = await getProductPage(url);
  const $ = cheerio.load(page);
  const { quantity, unit } = getQuantity($('.price-per-quantity-weight span.weight').text());

  return {
    name: $('h1.product-details-tile__title').text(),
    url,
    image: $('img.product-image').attr('src'),
    price: Number($('.price-per-sellable-unit span[data-auto=price-value]').text()),
    refPrice: Number($('.price-per-quantity-weight span[data-auto=price-value]').text()),
    refQuantity: quantity,
    refUnit: unit,
    rating: Number($('span.beans-star-rating__average-rating-text').text()),
    reviews: Number(
      $('a.reviews-stats__star-rating span.beans-star-rating__ratings-count').text().slice(1).slice(0, -1)
    ),
    category: getCategory($),
    ingredients: $('#ingredients p.product-info-block__content').text(),
    nutrition: getNutrition($),
  };
};

module.exports = {
  getProduct,
  searchProducts,
};
