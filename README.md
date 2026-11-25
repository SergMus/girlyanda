# Girlyanda

A local MVP for a Ukrainian-language online store and festive lighting studio. The public catalog uses Girlyanda product names and SKUs. Product assortment sources are listed in the internal documentation.

## Getting started

Use Node.js 22.22.3 or later in the 22.x series, 24.15.0 or later in the 24.x series, or any 26.x release.

```sh
npm ci
npm start
```

The application runs on port 4200. `npm start` also starts the local installation request API on port 4300. [Open the application](http://127.0.0.1:4200/)

```sh
npm test
npx playwright install chromium
npm run e2e
npm run build
```

## Architecture

- The frontend uses Angular 22.3, TypeScript in strict mode, standalone components, Signals, lazy-loaded routes, and responsive SCSS. Headings use Manrope, while body text and interface controls use Golos Text. The “Light Spiral” logo is available in two color variants in `public/media`. The build includes both fonts.
- `src/app/catalog` contains categories, types, the product assortment, variant galleries, search, filtering, and sorting. `CatalogRepository` provides the integration point for an API. The product model defines valid combinations of light color, wire color, and size. Each variant has a price in kopiykas, an availability status, and a gallery.
- `src/app/orders` contains the SKU-based cart and checkout. Selected variants are stored in `localStorage`. `SubmissionGateway` saves demo orders in IndexedDB and sends installation requests with photos to `POST /api/installation`.
- `src/app/studio` contains the installation, portfolio, and studio information pages, along with the installation request form. `src/app/shared` contains shared icons and the before-and-after comparison component. The catalog and installation SVG illustrations are in `public/media`. The homepage cards link to three galleries at `/roboty/:category`. Project names, optional locations, and photos are defined in `src/app/studio/projects.ts`. Photos for the “Ideas for Your Space” section are defined in `src/app/home/home.page.ts`.
- Prices and availability remain unspecified until retail pricing is agreed on and an inventory source is confirmed. Add the studio’s actual contact information, history, and team details once that information is available.

## Sending installation requests

The “Installation Request” form sends the message and an optional JPEG, PNG, or WebP photo of up to 10 MB to `umt1@ukr.net`. If the form cannot send the request, it offers to open a pre-filled email in the user’s mail app. The user can attach the photo manually.

For Resend, verify a sending domain such as `notify.girlyanda.net.ua` and create a key with sending access. Set `GIRLYANDA_RESEND_API_KEY` and `GIRLYANDA_RESEND_FROM` in the server environment. The sender address must belong to the verified domain, for example `no-reply@notify.girlyanda.net.ua`. On Render, add both values under Environment. Resend sends over HTTPS and takes precedence when its API key is configured. [Verify a Resend domain](https://resend.com/docs/add-a-domain) · [Manage Resend API keys](https://resend.com/docs/dashboard/api-keys/introduction)

For SMTP, create a separate app password in your UKR.NET mail settings and save it in `GIRLYANDA_SMTP_PASSWORD`. The server connects to `smtp.ukr.net` on port 465 using TLS. The sender address comes from `GIRLYANDA_SMTP_USER` and defaults to `umt1@ukr.net`. For local development, set the mail variables in the root `.env` file, which is excluded from Git. [UKR.NET guide to creating an app password](https://wiki.ukr.net/GenerateAppSpecificPassword)

```sh
npm run build
npm run serve:mail
```

The server serves the build and accepts installation requests on port 4300. During development, Angular proxies `/api/installation` to the API started by `npm start`. Restart the server after editing `.env` to load the new mail settings. If you use static hosting, route `/api/installation` to a Node.js server configured to send email. If you host the entire site on Node.js, set `GIRLYANDA_SERVER_HOST` and `GIRLYANDA_SERVER_PORT` in the hosting environment as needed. [Open the local installation request form](http://127.0.0.1:4300/zaiavka)

## Cloudflare Workers deployment

The Worker serves the pre-rendered Angular build as static assets and handles `/api/installation` on the same origin. After running `npm ci` and signing in with Wrangler, run `npm run deploy:cloudflare` to deploy to the `workers.dev` address shown by the CLI.

In Cloudflare, open the Worker's **Settings → Variables and Secrets**. Add `GIRLYANDA_RESEND_API_KEY` as a secret and `GIRLYANDA_RESEND_FROM` as a variable. Verify the preview site and submit a test request with a photo before switching the custom domain. Copy the `notify` sending records to Cloudflare DNS before changing nameservers. [Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/) · [Worker custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)

## SEO and media

The build pre-renders HTML for public pages, portfolio sections, categories, subcategories, and product pages in `dist/girlyanda/browser`. The cart and checkout use `noindex`, and locally stored data loads after the initial render. For static hosting, configure the host to serve an existing `index.html` for each directory and fall back to `index.csr.html` for other routes. Once the site has a domain, add canonical URLs, a sitemap, and deployment settings. Revisit per-request server-side rendering if the catalog starts changing frequently or if data needs to appear in indexable HTML before the next build.

Posters and photos are stored locally in WebP format. The homepage gives a responsive poster loading priority. On wide screens, a short WebM video plays when the user’s motion and data-saving settings allow it. The video uses demonstration images. Portfolio demo videos load when the viewer opens. Users can browse photos and videos within the selected category. The before-and-after facade comparison is available in the main gallery and in the residential gallery.

The documentation covers SKU mappings, supplier listings, product selection references, and local image sources. [Product assortment guide](docs/assortment.md) · [Media register](docs/media.md)
