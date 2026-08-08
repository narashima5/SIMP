# Smart Internship Management Platform (SIMP)

SIMP is a full-stack Internship Tracking and Coordination System designed to connect Students, Faculty Coordinators, Recruiting Organizations, and Admins.

---

## 🏗️ Technical Stack & Architecture

### Backend (`SIMP-API`)
* **Core**: Node.js, Express, TypeScript, MongoDB, Mongoose
* **Authentication**: JWT-based stateless authentication (Access Token + Refresh Token flow)
* **Security**: Password hashing via `bcryptjs`, Input validation via `express-validator`
* **Role-Based Authorization**: Middlewares mapping user context (`req.user`) to specific routes.

### Frontend (`SIMP`)
* **Core**: React.js 19, TypeScript, Vite, React Router 6, Context API
* **Styling**: Material UI v6 + Tailwind CSS (hybrid styling architecture)
* **Forms**: `react-hook-form` for form validation
* **HTTP Client**: Custom Axios instance with interceptors for token attachment and rotation.

---

## 🔒 Authentication Flow & Integration

### JWT Storage & Interceptors
1. **Login/Register**: User sends credentials to `/api/auth/login` or `/api/auth/register`.
2. **Tokens**: The server responds with:
   - `token`: Short-lived JWT access token (stored in localStorage: `simp_token`).
   - `refreshToken`: Long-lived JWT token (stored in localStorage: `simp_refresh_token`).
   - `user`: User payload details (stored in localStorage: `simp_user`).
3. **Authorization Header**: The custom Axios client (`src/services/api.ts`) intercepts outgoing requests and automatically appends the `Authorization: Bearer <token>` header if a token is present.
4. **Token Refresh Rotation**:
   - If an API request fails with a `401 Unauthorized` error, the response interceptor automatically captures it.
   - It pauses the failed request queue, calls `/api/auth/refresh` with the stored `refreshToken`, receives a new access token, updates `localStorage`, and retries the failed requests.
5. **Auto-Logout**:
   - If the refresh token has expired or is invalid, the interceptor clears all auth tokens and dispatches a `simp_auth_expired` event, automatically logging the user out and redirecting them to the `/login` portal.

---

## 🛠️ Setup and Installation

### Prerequisite: MongoDB
Ensure you have a MongoDB instance running locally or a MongoDB Atlas connection string.

### 1. Backend Server Setup
1. Open the backend folder: `SIMP-API`
2. Create a `.env` file in the root with:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/simp
   JWT_SECRET=your_super_secret_access_token_key_here
   JWT_REFRESH_SECRET=your_super_secret_refresh_token_key_here
   JWT_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d
   NODE_ENV=development
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Web Setup
1. Open the frontend folder: `SIMP`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server (automatically proxies `/api` calls to `http://localhost:5000` via `vite.config.ts`):
   ```bash
   npm run dev
   ```

---

## 🧪 Development Sandbox: Quick Role Login

For testing and grading convenience, the **Login** portal features a **"Development Sandbox: Quick Role Login"** grid. 
Clicking any of these cards automatically attempts to sign in with predefined local test credentials. If the database is clean, the sandbox will automatically create (seed) the sandbox profiles in MongoDB:

* **Student**: `student@student.edu` / `password123`
* **Faculty Coordinator**: `coordinator@university.edu` / `password123`
* **Recruiting Organization**: `org@company.com` / `password123`
* **Admin**: `admin@simp.org` / `password123`
