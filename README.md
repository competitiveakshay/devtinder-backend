# DevTinder — Backend

DevTinder is a full-stack developer networking platform (a "Tinder for developers") that lets users create profiles, browse a feed of other developers, send/accept/reject connection requests, and manage their network. This repository contains the **backend REST API**, built with Node.js, Express, and MongoDB.

🔗 **Live app:** [http://51.21.129.102/](http://51.21.129.102/)
🔗 **Frontend repo:** [devtinder-frontend](https://github.com/competitiveakshay/devtinder-frontend)

---

## ✨ Features

- User authentication (signup, login, logout) with JWT stored in HttpOnly cookies
- Password hashing with bcrypt
- Profile view and edit with field-level validation
- Developer feed with pagination
- Send / review connection requests (interested, ignored, accepted, rejected)
- View received requests and active connections
- CORS-enabled API for a separate frontend client

---

## 🛠️ Tech Stack

| Layer          | Technology                          |
|----------------|--------------------------------------|
| Runtime        | Node.js                              |
| Framework      | Express 5                            |
| Database       | MongoDB with Mongoose 8              |
| Auth           | JSON Web Tokens (jsonwebtoken)       |
| Password Hash  | bcrypt                               |
| Validation     | validator                            |
| Middleware     | cookie-parser, cors                  |

---

## 📁 Project Structure

```
devtinder-backend/
├── src/
│   ├── app.js                  # App entry point, middleware & route mounting
│   ├── config/
│   │   └── database.js         # MongoDB connection setup
│   ├── middlewares/
│   │   └── auth.js             # JWT-based auth middleware (userAuth)
│   ├── models/
│   │   ├── user.js             # User schema (with getJWT, validatePassword)
│   │   └── connectionRequest.js# Connection request schema
│   ├── routes/
│   │   ├── auth.js             # Signup, login, logout
│   │   ├── profile.js          # View / edit profile
│   │   ├── requests.js         # Send / review connection requests
│   │   └── user.js             # Feed, connections, received requests
│   └── utils/
│       └── validation.js       # Signup & profile edit validation helpers
├── package.json
└── .gitignore
```

---

## 📡 API Endpoints

All routes are mounted at the root (`/`). Routes marked 🔒 require authentication via the `userAuth` middleware (JWT cookie).

### Auth (`src/routes/auth.js`)
| Method | Endpoint         | Description                          |
|--------|------------------|---------------------------------------|
| POST   | `/signup`        | Register a new user                   |
| POST   | `/login`         | Authenticate user, sets JWT cookie    |
| POST   | `/logout`        | Clears the auth cookie                |

### Profile (`src/routes/profile.js`)
| Method | Endpoint          | Description                      |
|--------|-------------------|-----------------------------------|
| GET 🔒 | `/profile/view`   | Get the logged-in user's profile |
| PATCH 🔒| `/profile/edit`  | Update editable profile fields   |

### Connection Requests (`src/routes/requests.js`)
| Method | Endpoint                                     | Description                                       |
|--------|-----------------------------------------------|----------------------------------------------------|
| POST 🔒| `/request/send/:status/:toUserId`            | Send a request (`status`: interested / ignored)    |
| POST 🔒| `/request/review/:status/:requestId`         | Review a received request (`status`: accepted / rejected) |

### User & Feed (`src/routes/user.js`)
| Method | Endpoint                    | Description                                     |
|--------|------------------------------|--------------------------------------------------|
| GET 🔒 | `/user/requests/recieved`   | List requests received by the logged-in user     |
| GET 🔒 | `/user/connections`         | List accepted connections                         |
| GET 🔒 | `/feed`                     | Paginated feed of other users (`?page`, `?limit`) |

**Total: 10 endpoints**

---

## ⚙️ Setup & Installation

1. Clone the repo
   ```bash
   git clone https://github.com/competitiveakshay/devtinder-backend.git
   cd devtinder-backend
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Configure MongoDB connection in `src/config/database.js` (connection string).
4. Start the server
   ```bash
   npm start
   ```
   The server listens on **port 8000**.

---

## 🔗 Frontend Integration

This backend is designed to be consumed by the companion **DevTinder frontend** repo:
👉 [github.com/competitiveakshay/devtinder-frontend](https://github.com/competitiveakshay/devtinder-frontend)

- **Stack:** React 19, Vite 7, Redux Toolkit + React Redux, React Router DOM 7, Tailwind CSS 4 + DaisyUI, Axios
- **API base URL:** the frontend calls this backend via `BASE_URL = "/api"` (see `src/utils/constant.js`), proxied to `http://localhost:8000` in development
- **CORS:** the backend's CORS config (`src/app.js`) explicitly allows `http://localhost:5173` (the Vite dev server) with `credentials: true`, since auth relies on HttpOnly cookies rather than bearer tokens
- **State management:** Redux slices on the frontend (`userSlice`, `feedSlice`, `connectionSlice`, `requestSlice`) mirror the backend's core resources — user/auth, feed, connections, and requests — keeping client state in sync with the API responses above
- **Routing:** frontend pages map directly onto backend capabilities:
  - `/login` → Auth endpoints
  - `/` (Feed) → `GET /feed`
  - `/profile` → `GET/PATCH /profile/*`
  - `/connections` → `GET /user/connections`
  - `/requests` → `GET /user/requests/recieved`, `POST /request/*`

To run the full stack locally: start this backend on port 8000, then run the frontend's `npm run dev` (Vite, default port 5173) with requests proxied to `/api`.

---

## 📌 Notes

- Authentication uses HttpOnly JWT cookies rather than tokens in headers/localStorage, which is why CORS is configured with explicit origin + `credentials: true` rather than a wildcard.
- The `requests.js` and `user.js` routes rely on a compound relationship between `User` and `ConnectionRequest` models to compute feeds (excluding already-contacted users) and connection lists.
