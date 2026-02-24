# Eshop REST API — Maison Élève

A full-stack e-commerce application for a bespoke evening wear boutique.

This was my first team fullstack project, built during my web development training.
I worked on the **backend** alongside a teammate. The frontend was originally assigned 
to other team members but could not be completed in time — it was later rebuilt 
with the assistance of AI (Claude Sonnet 4.6) to present a functional, end-to-end portfolio piece.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas + Mongoose
- **Auth**: JWT (JSON Web Tokens)
- **Security**: Bcrypt (password hashing)
- **Session**: Express-session + Cookie-parser
- **Frontend**: HTML, CSS, Vanilla JS *(ideally to be rebuilt in React in a future iteration)*

## Project Structure
```
├── controllers/         # Business logic
├── middleware/          # Auth & role checking
├── Models/              # Mongoose schemas
├── public/              # Frontend (HTML/CSS/JS)
├── routes/              # Express routers
├── seed.mjs             # Database seeding script
├── index.mjs            # App entry point
└── .env.example         # Environment variables template
```

## Installation

1. Clone the repo
```
git clone git@github.com:alizee-dev/Eshop--REST-API.git
```

2. Install dependencies
```
npm install
```

3. Create a `.env` file at the root based on `.env.example`
```
username_mongo=your_mongodb_username
mongo_password=your_mongodb_password
SECRET_KEY=your_jwt_secret_key
PORT=9000
```

4. Seed the database
```
node seed.mjs
```

5. Start the server
```
node index.mjs
```

6. Open your browser at `http://localhost:9000`

## API Routes

### Authentication
| Method | Route | Description |
|--------|-------|-------------|
| POST | /register/admin | Create an admin account |
| POST | /register/employee | Create an employee account |
| POST | /login/admin | Admin login |
| POST | /login/employee | Employee login |

### Products
| Method | Route | Description | Auth required |
|--------|-------|-------------|---------------|
| GET | /products | Get all products | No |
| GET | /products/:productId | Get a product by reference | No |
| POST | /products/add-product | Add a product | Yes (admin/employee) |
| DELETE | /products/:productId | Delete a product | Yes (admin/employee) |
| PATCH | /products/:productId | Update a product | Yes (admin/employee) |

### Cart
| Method | Route | Description |
|--------|-------|-------------|
| POST | /cart/:productId | Add a product to cart |
| GET | /cart | View current cart |
| POST | /cart/checkout | Place an order |

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```
The token is obtained at login and is valid for 3 days.

## Notes

- The frontend is intentionally kept simple (HTML/CSS/JS) and would benefit from 
  a React rewrite as a next step.
- All garments are made to measure — the cart collects chest, waist and hip 
  measurements for each order.
- Passwords stored in the database are hashed with bcrypt.