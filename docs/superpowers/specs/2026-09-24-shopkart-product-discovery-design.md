# ShopKart Product Discovery — Design

## Goal

Extend the existing ShopKart authentication application with a MongoDB-backed
product catalogue and React product discovery experience for Engineering Lab 03.
The work preserves the current customer authentication APIs and visual style.

## Backend

Add a `Product` Mongoose model with required `name`, `description`, `price`,
`category`, `image`, and `stock` fields. `price` has a minimum greater than
zero, `stock` has a minimum of zero, and timestamps generate `createdAt`.

Mount a product router at `/products` with the following controller-backed
endpoints:

| Method | Endpoint | Response / behavior |
| --- | --- | --- |
| POST | `/products` | Creates and returns the product with status 201; validation failures return 400. |
| GET | `/products` | Returns `{ success, count, products }`; optional case-insensitive `search` matches `name`, optional `category` matches category, and optional `sort=price_asc|price_desc` orders price. |
| GET | `/products/:id` | Returns one product; malformed IDs return 400 and nonexistent IDs return 404. |

The list projection retains only fields the UI requires: ID, name, description,
price, category, image, stock, and creation timestamp if needed.

## Frontend

Install and use `react-router-dom` in place of the existing hand-written
history router. Existing authentication remains available at `/`; successful
authentication routes to `/home`.

`/home` remains the existing welcome page, with Shop Now / View All / Shop
navigation entering `/products`. `/products` fetches the catalogue dynamically,
has a search input and category selector, and renders API products through
`ProductCard`. Each card shows image, name, category, INR price, stock status,
and a details link.

`/products/:id` reads its URL parameter, requests one product, and displays a
large image, name, description, price, category, stock, and an inactive
Add-to-Cart UI button.

Code is separated into `pages`, `components`, and `services/api.js`; a Navbar
centralizes navigation and logout behavior.

## Data flow and states

The listing page owns `search` and `category` state. A small debounce limits
requests while users type. Each change calls the service layer, which encodes
query parameters and requests the backend. The backend performs filtering in
MongoDB, and React renders the returned array using `.map()`.

Listing and detail pages explicitly render loading, API/network error, and
empty/not-found states. API failures use user-facing messages rather than blank
content.

## Verification

Verify product API creation, listing, search, category filtering, combined
filtering, sorting, malformed IDs, and missing IDs. Build and lint the client,
then manually confirm navigation from home to listing to a product detail page
when a MongoDB connection is configured.
