# EBImax Solutions

{

"store_metadata": {

    "name": "EBImax Technique",

    "tagline": "Équipements industriels, énergie et outillage professionnel",

    "currency": "FCFA",

    "contact_phone": "+221 71 116 91 91",

    "contact_email": "contact@ebimax-industrials.com",

    "whatsapp_number": "221711169191"

},

"navigation": [

    { "label": "Accueil", "slug": "/", "icon": "home" },

    { "label": "Énergie & Solaire", "slug": "/catalog/energie-solaire", "featured": true },

    { "label": "Pompes & Eau", "slug": "/catalog/pompes-eau", "featured": true },

    { "label": "Outillage & Chantier", "slug": "/catalog/outillage-chantier", "featured": false },

    { "label": "Sécurité & Coffres", "slug": "/catalog/securite-coffres", "featured": false },

    { "label": "Gaz & Froid", "slug": "/catalog/gaz-froid", "featured": false }

],

"hero_banner": {

    "title": "Générateurs Industriels KPOR",

    "subtitle": "Fiables, robustes et adaptés aux conditions exigeantes de chantier.",

    "cta_text": "Demander un devis",

    "cta_link": "/catalog/energie-solaire",

    "background_image": "/images/hero-kpor.jpg"

},

"categories_grid": [

    {

      "id": "cat-1",

      "name": "Énergie & Solaire",

      "slug": "energie-solaire",

      "image": "/images/categories/energy.jpg",

      "item_count": 14

    },

    {

      "id": "cat-2",

      "name": "Pompes à Eau & Irrigation",

      "slug": "pompes-eau",

      "image": "/images/categories/pumps.jpg",

      "item_count": 22

    },

    {

      "id": "cat-3",

      "name": "Outillage & Chantier",

      "slug": "outillage-chantier",

      "image": "/images/categories/tools.jpg",

      "item_count": 35

    },

    {

      "id": "cat-4",

      "name": "Sécurité & Coffres-forts",

      "slug": "securite-coffres",

      "image": "/images/categories/safes.jpg",

      "item_count": 8

    },

    {

      "id": "cat-5",

      "name": "Gaz Réfrigérants",

      "slug": "gaz-froid",

      "image": "/images/categories/gas.jpg",

      "item_count": 10

    }

],

"featured_products": [

    {

      "id": "prod-01",

      "title": "Motopompe Pedrollo CP 158",

      "brand": "Pedrollo",

      "sku": "PED-CP158",

      "category": "Pompes à Eau & Irrigation",

      "price_indicator": "Sur devis",

      "is_quote_only": true,

      "stock_status": "in_stock",

      "stock_label": "En stock magasin",

      "image": "/images/products/pedrollo-cp158.jpg",

      "specs": {

        "puissance": "1.5 HP",

        "debit_max": "160 L/min",

        "alimentation": "220V"

      }

    },

    {

      "id": "prod-02",

      "title": "Groupe Électrogène KPOR Diesel",

      "brand": "KPOR",

      "sku": "KPO-KDE5000",

      "category": "Énergie & Solaire",

      "price_indicator": "850 000 FCFA",

      "is_quote_only": false,

      "stock_status": "in_stock",

      "stock_label": "En stock magasin",

      "image": "/images/products/kpor-gen.jpg",

      "specs": {

        "puissance": "5 kVA",

        "carburant": "Diesel",

        "demarrage": "Électrique"

      }

    },

    {

      "id": "prod-03",

      "title": "Perceuse & Marteau Piqueur EBImax",

      "brand": "EBImax",

      "sku": "EBI-ROT2071",

      "category": "Outillage & Chantier",

      "price_indicator": "65 000 FCFA",

      "is_quote_only": false,

      "stock_status": "low_stock",

      "stock_label": "Stock limité",

      "image": "/images/products/ebimax-drill.jpg",

      "specs": {

        "puissance": "1300W",

        "frequence": "50-60Hz",

        "mandrin": "SDS-Plus"

      }

    },

    {

      "id": "prod-04",

      "title": "Coffre-fort Électronique Blindé",

      "brand": "EBImax",

      "sku": "SAF-DIG-04",

      "category": "Sécurité & Coffres-forts",

      "price_indicator": "Sur devis",

      "is_quote_only": true,

      "stock_status": "on_demand",

      "stock_label": "Sur commande (48h)",

      "image": "/images/products/safe.jpg",

      "specs": {

        "type": "Clavier numérique + Clé",

        "securite": "Double gâche en acier",

        "poids": "45 kg"

      }

    }

]

}

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ebimax-industrial-pro.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/29ce2c74-5427-4912-a8fb-eadb979b0af8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
