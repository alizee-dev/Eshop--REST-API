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
| POST | /login/admin | Admin login |
| POST | /login/employee | Employee login |

### Users
| Method | Route | Description | Auth required |
|--------|-------|-------------|---------------|
| POST | /users/admin | Create an admin account | No |
| POST | /users/employee | Create an employee account | Yes (admin) |
| GET | /users/employee | Get all employees | Yes (admin) |
| GET | /users/employee/:userId | Get one employee | Yes (admin) |
| PATCH | /users/employee/:userId | Update an employee | Yes (admin) |
| DELETE | /users/employee | Delete an employee | Yes (admin) |

### Products
| Method | Route | Description | Auth required |
|--------|-------|-------------|---------------|
| GET | /products | Get all products | No |
| GET | /products/:productId | Get a product by reference | No |
| POST | /products/add-product | Add a product | Yes (admin/employee) |
| DELETE | /products/:productId | Delete a product | Yes (admin/employee) |
| PATCH | /products/:productId | Update a product | Yes (admin/employee) |

### Cart & Orders
| Method | Route | Description | Auth required |
|--------|-------|-------------|---------------|
| POST | /cart/:productId | Add a product to cart | No |
| GET | /cart | View current cart | No |
| POST | /cart/checkout | Checkout (Stripe if configured) | No |
| GET | /cart/orders | Get all orders | Yes (admin) |
| GET | /cart/orders/:orderId | Get one order | Yes (admin) |

### Email
| Method | Route | Description |
|--------|-------|-------------|
| POST | /email | Send a contact email |

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```
The token is obtained at login and is valid for 3 days.

## Payment

This project integrates **Stripe** for payment processing.
To enable Stripe, add your secret key to the `.env` file:
```
STRIPE_KEY=sk_test_...
```
For testing, use Stripe's test card:
- Number: `4242 4242 4242 4242`
- Date: any future date
- CVC: any 3 digits

Without a Stripe key, the app falls back to a simple order confirmation.

## Email

Contact form powered by **Mailgun** via Nodemailer.
To enable, add your Mailgun credentials to `.env`:
```
MAILGUN_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
CONTACT_EMAIL=your_email@example.com
```

## API Documentation

A full Postman collection is available in the repository: `MaisonEleve.postman_collection.json`

It covers all 19 endpoints organized in 5 folders: Auth, Users, Products, Cart/Orders, and Email.

To use it:
1. Import the file in Postman
2. Create an environment with `base_url = http://localhost:9000` and an empty `token` variable
3. Run **Login Admin** first — the token is saved automatically via a test script
4. All protected routes will use `{{token}}` automatically

## Notes

- Built as my first fullstack team project during web development training.
- I was responsible for the **backend**. The frontend was originally assigned to other team members but could not be completed — it was later rebuilt with the assistance of AI (Claude Sonnet 4.6).
- The frontend is intentionally kept in HTML/CSS/JS and would benefit from a React rewrite as a next step.
- All garments are made to measure — the cart collects chest, waist and hip measurements for each order.
- Passwords are hashed with bcrypt.
- JWT tokens are valid for 3 days.


## Future improvements

- Stripe webhook to update order status after payment
- React frontend rewrite
- User-facing order tracking
- Mailgun integration for order confirmation emails