# Zoom Meeting Scheduler — Server

Backend API for a Zoom meeting scheduling platform. Built with **NestJS**, **TypeORM (MySQL)**, and **Firebase Admin** for authentication. Admins and customer-service representatives create meeting requests with experts, meetings are scheduled on **Zoom**, and payments are collected via **SSLCommerz**. Files are uploaded to **Cloudinary**.

## Features

- **Role-based auth** — Firebase ID-token auth for `admin`, `expert`, and `customer-service-representative` roles, plus bearer-token auth for end users against an external JWT endpoint.
- **Meeting scheduling** — create and manage meetings, with a scheduled job used to trigger meeting creation on Zoom.
- **Zoom integration** — creates Zoom users and meetings via the Zoom API using a signed JWT.
- **Payments** — SSLCommerz payment gateway with IPN validation.
- **File & image upload** — Cloudinary-backed image storage plus local file upload.
- **Email** — transactional mail via the `@nestjs-modules/mailer` SMTP.

## Tech Stack

- [NestJS](https://nestjs.com/) 7 · TypeScript
- [TypeORM](https://typeorm.io/) + MySQL (`mysql2`)
- [Firebase Admin](https://firebase.google.com/docs/admin/setup) SDK
- [Cloudinary](https://cloudinary.com/) file/image storage
- [SSLCommerz](https://www.sslcommerz.com/) payment gateway
- [Axios](https://axios-http.com/)

## Project Structure

```
src/
  admin/                  Admin CRUD
  auth/                   Firebase + JWT auth, role guards and entities
  customer-service-representative/  CSR meeting handling
  expert/                 Expert meeting accept/reject
  meeting/                Meeting scheduling service
  payment-gateway/        SSLCommerz payment + IPN
  zoom/                   Zoom API client
  image/                  Cloudinary image upload
  file/                   Local file upload
  mail/                   @nestjs-modules/mailer wrapper
  user/                   User meeting requests
  main.ts                 Bootstrap
```

## Getting Started

### Prerequisites

- Node.js 14+ and Yarn
- MySQL server
- Zoom API credentials (JWT app)
- An SSLCommerz store
- A Cloudinary account
- A Firebase project with an Admin SDK service account

### Setup

```bash
# 1. Install dependencies
yarn install

# 2. Create your config from the template
cp .env.example .env
#    ...and fill in every value with your own credentials
#    (the template contains only placeholders)

# 3. Put your Firebase service-account JSON somewhere outside the repo
#    and point FIREBASE_CREDENTIAL_PATH at its absolute path.

# 4. Run the dev server
yarn start:dev
```

The API runs at `http://localhost:3000`.

> ⚠️ **Never commit your real `.env` or any Firebase service-account JSON.** They are git-ignored for a reason. Rotate any credential that may have been exposed.

## Scripts

| Command          | Description                              |
| ---------------- | ---------------------------------------- |
| `yarn start`     | Start the API                            |
| `yarn start:dev` | Start in watch mode                      |
| `yarn start:prod`| Run the compiled production build        |
| `yarn build`     | Compile to `dist/`                       |
| `yarn lint`      | ESLint + Prettier fix                    |
| `yarn test`      | Unit tests (Jest)                        |
| `yarn test:e2e`  | End-to-end tests                         |

## Environment Variables

See [`.env.example`](.env.example) for the full list and descriptions. Key ones:

| Variable                      | Purpose                                    |
| ----------------------------- | ------------------------------------------ |
| `DATABASE_*`                  | MySQL connection                           |
| `ZOOM_API_KEY` / `ZOOM_SECRET`| Zoom JWT app credentials                   |
| `SSL_COMMERZ_*`               | SSLCommerz store and payment config        |
| `CLOUDINARY_*`                | Cloudinary cloud + credentials             |
| `FIREBASE_CREDENTIAL_PATH`    | Absolute path to the Firebase service-account JSON |
| `MAIL_*`                      | SMTP email settings                        |

## License

UNLICENSED — private project.