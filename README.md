# Timbertop United Shop

Timbertop United Shop is a full-stack football club merchandise prototype. 

## Requirements

- Node.js 18 or later
- npm

## Getting Started

Install dependencies in both applications:

```bash
cd client
npm install

cd ../server
npm install
```

### Environment secrets

**Server**: Create `server/.env` from `server/.env.example`. Set a private random `JWT_SECRET` (at least 32 characters) and a unique `ADMIN_PASSWORD` (at least 12 characters). The API refuses to start with missing or placeholder values. Generate a random JWT secret with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.

**Client**: Create `client/.env` from `client/.env.example` if the API is not running at the default URL. 

### Firestore setup

To enable Firestore:

1. Create a Firebase project and create a **Cloud Firestore** database in the Firebase Console.
2. In **Project settings → Service accounts**, generate a private service-account JSON key. Save it as `server/service-account.json`. It is ignored by Git and must remain private.
3. Set `FIREBASE_PROJECT_ID` and `GOOGLE_APPLICATION_CREDENTIALS=./service-account.json` in `server/.env` (using the example file as a starting point).
4. Start the server from the `server` directory with `npm run dev`. Check `http://localhost:1337/api/health`.

Firestore credentials are required to run the API. On first use, an empty Firestore database is initialized with the starter products and news articles, and the fixed admin account is synchronized to the configured `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Starter products and news are only inserted if their collections are empty. Existing collections are left as-is.

Product images are stored in the API server's `server/uploads/product-images/` folder,  Four sample photos are included under `server/src/data/product-images/`; the API copies them into the uploads folder and seeds their URLs with the starter products. Set `API_PUBLIC_URL` to the externally reachable server base URL when deploying. For deployment, use a host with persistent disk or uploaded images will be lost when its filesystem is reset.

---

The admin email defaults to `admin@timbertop.com`; use the password set in `server/.env`.

Start the API in one terminal:

```bash
cd server
npm run dev
```

Start the website in another terminal:

```bash
cd client
npm run dev
```

The API listens on `http://localhost:1337` by default. The client uses that API unless `VITE_API_URL` is set, for example `VITE_API_URL=http://localhost:1337/api`.

## API

All successful API responses are JSON.

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | Public | Health and storage status |
| GET | `/api/products` | Public | List products with optional `q`, `category`, and `sort` (`name`, `price-asc`, `price-desc`) |
| GET | `/api/products/:id` | Public | Read one product |
| POST | `/api/products` | Admin | Create a product |
| PUT | `/api/products/:id` | Admin | Replace a product |
| DELETE | `/api/products/:id` | Admin | Delete a product |
| POST | `/api/uploads/images` | Admin | Upload a product image to the server (`multipart/form-data`, field `image`) |
| GET | `/api/news` | Public | List articles, newest first |
| GET | `/api/news/:id` | Public | Read one article |
| POST | `/api/news` | Admin | Create an article |
| PUT | `/api/news/:id` | Admin | Replace an article |
| DELETE | `/api/news/:id` | Admin | Delete an article |
| POST | `/api/users/register` | Public | Register a user |
| POST | `/api/users/login` | Public | Authenticate and receive a JWT |
| GET | `/api/users/me` | Authenticated | Read the current user without password data |
| POST | `/api/contact` | Public | Submit a contact message |
| POST | `/api/newsletter` | Public | Subscribe an email address |
