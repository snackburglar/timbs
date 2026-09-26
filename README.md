# Timbertop United Shop

Timbertop United Shop is a full-stack football club merchandise prototype. The React/Vite client consumes a Node/Express REST API. The API currently uses local in-memory mock modules instead of Firestore, so write operations reset when the server restarts.

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

Create `server/.env` from `server/.env.example` and set a private `JWT_SECRET`. Create `client/.env` from `client/.env.example` if the API is not running at the default URL. The default admin account is:

```text
Email: admin@timbertop.com
Password: Admin123!
```

Change the admin password before sharing the application. `server/.env` is ignored by Git.

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

All successful API responses are JSON. Product and news reads are public. Product writes require a bearer token for an administrator.

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | Public | Health and storage status |
| GET | `/api/products` | Public | List products; supports `q`, `category`, and `sort` (`name`, `price-asc`, `price-desc`) |
| GET | `/api/products/:id` | Public | Read one product |
| POST | `/api/products` | Admin | Create a product |
| PUT | `/api/products/:id` | Admin | Replace a product |
| DELETE | `/api/products/:id` | Admin | Delete a product |
| GET | `/api/news` | Public | List articles, newest first |
| GET | `/api/news/:id` | Public | Read one article |
| POST | `/api/news` | Admin | Create an article |
| PUT | `/api/news/:id` | Admin | Replace an article |
| DELETE | `/api/news/:id` | Admin | Delete an article |
| POST | `/api/users/register` | Public | Register a user |
| POST | `/api/users/login` | Public | Authenticate and receive a JWT |
| GET | `/api/users/me` | Authenticated | Read the current user without password data |
| POST | `/api/contact` | Public | Submit a contact message to local memory |
| POST | `/api/newsletter` | Public | Subscribe an email address to local memory |

Product writes require these fields: `name`, `category`, `price`, `initials`, `colour`, `description`, and `available`. Product and registration payloads are validated with Joi before use.

Example login:

```bash
curl -X POST http://localhost:1337/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@timbertop.com","password":"Admin123!"}'
```

Use the returned token as `Authorization: Bearer <token>` for admin writes.