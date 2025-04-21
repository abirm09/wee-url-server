# Welcome to WeeURL Link shortener web app

## 📚 Table of contents

- 📌 [Overview](#overview)
- 🔗 [Quick links](#quick-links)
- 🛠️ [Tech stack](#tech-stack)
- ✨ [Key features](#key-features)
- 🚀 [Getting Started](#getting-started)
  - ✅ [Prerequisites](#prerequisites)
  - 📦 [Installation](#installation)
  - 🔐 [Environment Variables](#environment-variables)
  - 🏃 [Running the App](#running-the-app)
- 📡 [API Reference](#api-reference)
- 🤝 [Contributing](#contributing)

## Overview

WeeURL server is a secure, fast, scalable, and production-ready server for an advanced URL-shortening web app. Built with modern technology, it provides smart server-side caching, ensures high availability during peak usage, and enables cost-effective deployments.

[Back to top](#welcome-to-weeurl-link-shortener-web-app)

## Quick links

- [Client side app](https://weeurl.abirmahmud.top)
- [Client side GitHub repo](https://github.com/abirm09/wee-url-client)
- [Server url (EC2)](https://weeurl.srv.abirmahmud.top/api/v1)
- [Server url (vercel)](https://wee.url.abirmahmud.top/api/v1)
- [Server side GitHub repo](https://github.com/abirm09/wee-url-server)

[Back to top](#welcome-to-weeurl-link-shortener-web-app)

## Tech Stack

- **🚀 Runtime & Server**

  - Node.js with Express 5
  - TypeScript
  - AWS EC2

- **🧱 Backend & ORM**

  - Prisma – Type-safe ORM
  - Redis – In-memory store for caching & rate limiting
  - PostgreSQL (via Prisma)

- **💳 Payments & Media**

  - Stripe – Payment gateway
  - Cloudinary – Image/media storage and optimization

- **📦 Package & Build Tools**

  - Yarn – Package manager
  - ts-node – Run TypeScript files
  - nodemon – Dev hot-reloading
  - cross-env – Cross-platform env management

- **🧪 Testing & Quality**

  - Vitest – Unit and integration testing
  - Supertest – API testing
  - ESLint – Linting
  - Prettier – Code formatting
  - Husky – Git hooks
  - Lint-Staged – Run linters on staged files

- **🛡️ Security & Middlewares**

  - Helmet – Set secure HTTP headers
  - CORS – Cross-origin resource sharing
  - cookie-parser – Parse cookies
  - compression – Gzip compression
  - express-rate-limit – Rate limiter
  - jsonwebtoken – JWT authentication
  - bcryptjs – Password hashing

- **📄 API & Docs**

  - Swagger UI Express – API documentation
  - swagger-jsdoc – Swagger spec generator
  - Zod – Schema validation

- **🔧 Utilities & Others**
  - dotenv – Environment variable loader
  - uuid – Unique ID generator
  - morgan – HTTP request logger
  - winston – Logger
  - multer – File upload handling
  - multer-storage-cloudinary – Cloudinary storage engine
  - otp-generator – OTP generation
  - device-detector-js – Device/user-agent detection
  - request-ip – IP address extraction

[Back to top](#welcome-to-weeurl-link-shortener-web-app)

## Key features

- 🔗 **Instant URL Shortening** – Convert long URLs into short, shareable links in seconds.
- 📈 **Click Analytics** – Track total clicks, geolocation, and device info.
- 🧑‍💻 **User Authentication** – Register, log in, TOP verification based access, and manage your own links.
- 🎨 **Custom Aliases** – Create personalized short URLs like `weeurl.srv.abirmahmud.top/abir123`.
- ☁️ **Media Upload Support** – Upload and attach user profile images via Cloudinary.
- 💳 **Stripe Integration** – Optional paid plans or premium link limits using Stripe.
- ⏳ **Link Expiration** – Set an expiration time for short links.
- 🛡️ **Rate Limiting** – Protects the server from spam and abuse.
- 🖼️ **EJS Views** – Server-rendered frontend for ads page for free users.

[Back to top](#welcome-to-weeurl-link-shortener-web-app)

## Getting Started

- ## Prerequisites

  - NodeJS v18 or later
  - yarn instal
  - PostgresSQL DB connection
  - Redis connection
  - Google SMTP setup
  - Cloudinary account and credentials
  - Stripe credentials
  - IP info token

- ## Installation

  Clone the project:

  ```bash
  git clone https://github.com/abirm09/wee-url-server.git
  ```

  Install dependencies:

  ```bash
  yarn
  ```

- ## Environment Variables

  Install dependencies:

  ```bash
  cp .env.example .env
  # Copy .env.example to .env and configure the environment variables.
  # Follow further instructions mentioned on .env.example file. Add all variables properly.
  ```

- ## Running the App

  Seed super admin:

  ```bash
  yarn seed
  ```

  Start server:

  ```bash
  yarn dev
  ```

[Back to top](#welcome-to-weeurl-link-shortener-web-app)

## API Reference

To get api docs please visit link below.

- [API docs](https://weeurl.srv.abirmahmud.top/api/v1/docs)

[Back to top](#welcome-to-weeurl-link-shortener-web-app)

## Contributing

- [MD Abir Mahmud](https://www.linkedin.com/in/abirm09/)

[Back to top](#welcome-to-weeurl-link-shortener-web-app)
