# API Documentation — Lost & Found Hub

Base URL: `/api`
All responses follow: `{ success: boolean, data?: T, message?: string, errors?: unknown }`
Authentication uses an **httpOnly JWT cookie** (`lfh_token`), set on login/register.

## Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | – | Register a new user |
| POST | `/api/auth/login` | – | Log in, sets auth cookie |
| POST | `/api/auth/logout` | – | Clear auth cookie |
| GET  | `/api/auth/me` | ✅ | Get current logged-in user |

## Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users/:id` | – | Get public profile |
| PUT | `/api/users/:id` | ✅ (self/admin) | Update profile |

## Categories
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/categories` | – | List all categories |

## Items
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/items` | – | List/search/filter items (`q, type, status, categoryId, color, brand, location, sort, page, limit`) |
| POST | `/api/items` | ✅ | Create a Lost/Found item |
| GET | `/api/items/:id` | – | Get item detail |
| PUT | `/api/items/:id` | ✅ (owner/admin) | Update item |
| DELETE | `/api/items/:id` | ✅ (owner/admin) | Delete item |
| POST | `/api/items/:id/favorite` | ✅ | Toggle favorite |
| GET | `/api/items/map` | – | Lightweight list of items that have coordinates (`type, status, category`), for the map view |

## Favorites
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/favorites` | ✅ | List current user's favorited items |

## Claims
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/claims?scope=mine\|received` | ✅ | List claims sent or received |
| POST | `/api/claims` | ✅ | Request to claim an item |
| PUT | `/api/claims/:id` | ✅ (item owner/admin) | Approve/reject a claim |

## Notifications
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/notifications` | ✅ | List current user's notifications |
| PUT | `/api/notifications/:id` | ✅ (owner) | Mark as read |

## Uploads
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/upload` | ✅ | Upload base64 image to Cloudinary, returns `{ url }` |

## Admin
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/stats` | ✅ Admin | Dashboard statistics |
| GET | `/api/admin/users` | ✅ Admin | List all users |
| PUT | `/api/admin/users/:id/ban` | ✅ Admin | Toggle ban status |
| GET | `/api/admin/items` | ✅ Admin | List all items |
| DELETE | `/api/admin/items/:id` | ✅ Admin | Delete any item |

## Error codes
`400` bad request · `401` unauthorized · `403` forbidden · `404` not found · `409` conflict · `422` validation error · `429` rate limited
