# BTesco API

![status: in progress](https://img.shields.io/badge/status-in--progress-green)

## About this Project

A BTec Tesco API client for use in other projects

### Built with

- Cheerio
- Axios
- Table to JSON

## Getting Started

### Prerequisites

- Node

### Installation

Copy `btesco.js` into your project then import/require the client.

```
const btesco = require('./btesco');
```

## Deployment

See installation

## Usage

### `btesco.getProduct` for more detailed information.

```
const product = await btesco.getProduct('https://www.tesco.com/groceries/en-GB/products/305254492');
```

```
{
  "name": "Walkers Wotsits Cheese Snacks 24 X 16.5G",
  "url": "https://www.tesco.com/groceries/en-GB/products/305254492",
  "image": "https://digitalcontent.api.tesco.com/v2/media/ghs/09f1f5b3-9280-4540-846e-e0ca5a91dd26/snapshotimagehandler_978308052.jpeg?h=540&w=540",
  "price": 4,
  "refPrice": 1.02,
  "refQuantity": 100,
  "refUnit": "g",
  "rating": 4.5,
  "reviews": 2,
  "category": "Multipack Crisps & Snacks",
  "ingredients": "Corn (Maize), Rapeseed Oil, Cheese Flavour [Whey Permeate (contains Milk), Dried Cheese (from Milk) (6%), Salt, Cheese Solids (from Milk), Dairy Solids (from Milk), Yeast Extract, Potassium Chloride, Acid (Lactic Acid), Flavour Enhancer (Disodium 5'-Ribonucleotides), Colours (Paprika Extract, Annatto Norbixin), Natural Flavouring (contains Milk)]",
  "nutrition": {
    "per 16.5g (%*) pack": {
      "-": {
        "quantity": 82,
        "unit": "kcal"
      },
      "fat": {
        "quantity": 5.3,
        "unit": "g"
      },
      ...
    },
    "per 100g": {
      "-": {
        "quantity": 494,
        "unit": "kcal"
      },
      "fat": {
        "quantity": 31.9,
        "unit": "g"
      },
      "of which saturates": {
        "quantity": 2.9,
        "unit": "g"
      },
      "carbohydrate": {
        "quantity": 46.2,
        "unit": "g"
      },
      "of which sugars": {
        "quantity": 7.2,
        "unit": "g"
      },
      "fibre": {
        "quantity": 0.2,
        "unit": "g"
      },
      "protein": {
        "quantity": 5.4,
        "unit": "g"
      },
      "salt": {
        "quantity": 1.58,
        "unit": "g"
      }
    }
  }
}
```

### `btesco.searchProducts` to search for a product.

```
const products = await btesco.searchProducts('protein bars');
```

```
[
  {
    "name": "Eat Natural Protein Bar 3 X 45G",
    "url": "https://www.tesco.com/groceries/en-GB/products/284256556",
    "image": "https://img.tesco.com/Groceries/pi/982/5013803991982/IDShot_225x225.jpg",
    "price": 2,
    "refPrice": 1.49,
    "refQuantity": 100,
    "refUnit": "g"
  }
  ...
]
```

## Roadmap

No planned features

## Release History

- v0.1.0
  - Initial functionality
