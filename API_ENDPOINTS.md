# Feez API Endpoints Documentation

This document lists all currently implemented API endpoints for the Feez fee management application.

---

## Health

### `GET /api/health`
- **Description:** Check system health and database connection status.
- **Response:**
  - `status`: healthy/unhealthy
  - `database`: MongoDB status
  - `environment`: Environment info
  - `timestamp`: Last check time

---

## Users

### `GET /api/users`
- **Description:** Fetch all users from the database.
- **Response:** Array of user objects

### `POST /api/users`
- **Description:** Create a new user account.
- **Request Body:**
  - `userName`: string
  - `user`: string (login/user)
  - `password`: string
- **Response:** Created user object or error

---

## Authentication

### `POST /api/auth/login`
- **Description:** Authenticate user and return JWT token.
- **Request Body:**
  - `user`: string (login/user)
  - `password`: string
- **Response:**
  - `success`: boolean
  - `data.token`: JWT token
  - `error`: error message (if any)

---

## Public Fees

### `GET /api/public-fees`
- **Description:** Get public fee status for all entries.
- **Response:** Array of entries with monthly payment status

### `POST /api/public-fees/filter`
- **Description:** Filter fee status by month and paid/unpaid status.
- **Request Body:**
  - `month`: number (1-12)
  - `paid`: boolean
- **Response:** Filtered entries

---

## Notes
- All endpoints return JSON responses.
- Authentication required for private dashboard routes (not yet documented).
- More endpoints will be added as the app evolves.
