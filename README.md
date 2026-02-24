# Eshop REST API

Backend of an e-commerce application built with Node.js, Express and MongoDB Atlas.
Project developed during my web development training.

## Tech Stack

- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT (authentication)
- Bcrypt (password hashing)
- Express-session (cart management)

## Installation

1. Clone the repo
git clone git@github.com:alizee-dev/Eshop--REST-API.git

2. Install dependencies
npm install

3. Create a `.env` file at the root based on `.env.example`

4. Start the server
node index.mjs

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
| GET | /products/:productId | Get a product | No |
| POST | /products/add-product | Add a product | Yes (admin/employee) |
| DELETE | /products/:productId | Delete a product | Yes (admin/employee) |
| PATCH | /products/:productId | Update a product | Yes (admin/employee) |

### Cart
| Method | Route | Description |
|--------|-------|-------------|
| POST | /cart/:productId | Add a product to cart |
| GET | /cart | View cart |
| POST | /cart/checkout | Place an order |

## Authentication

Protected routes require a JWT token in the header :
Authorization: Bearer <token>

The token is obtained at login and is valid for 3 days.