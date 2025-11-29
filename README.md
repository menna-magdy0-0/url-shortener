# URL Shortener

A high-performance URL shortening service built using NestJS, Prisma ORM, PostgreSQL, and Redis caching.
This project allows users to shorten URLs, retrieve original URLs, and redirect efficiently using both database storage and caching with Redis.

## Features

- Shorten long URLs
- Redirect using short codes
- Persistent storage via PostgreSQL + Prisma
- Redis caching
- Input validation using DTOs & class-validator


## Installation & Setup

### 1️⃣ Clone the project

```bash
git clone https://github.com/menna-magdy0-0/url-shortener.git
cd url-shortener
```

### 2️⃣ Install dependencies

```bash
npm ci
```

### 3️⃣ Environment variables (`.env`)

```
DB_DATABASE=urldb
DB_USERNAME=postgres
DB_PASSWORD=123

DATABASE_URL="postgresql://postgres:123@localhost:5432/urldb?schema=public"
```

### 4️⃣ Prisma setup

```bash
npx prisma migrate dev
npx prisma generate
```

### 5️⃣ Run internal services

```bash
docker compose up
```

### 6️⃣ Start server

```bash
npm run start:dev
```

---

## 🗄 Database Model (Prisma)

```prisma
model ShortUrl {
  id          Int      @id @default(autoincrement())
  shortCode   String   @unique
  url         String
  accessCount Int      @default(0)
  createdAt   DateTime @default(now())
}
```


# 📡 API Endpoints


### ▶️ Create Short URL

**POST /urls**

### Request:

```json
{
  "url": "https://google.com"
}
```

### Response:

```json
{
  "id": 1,
  "shortCode": "aB9dEfkT24",
  "url": "https://google.com",
  "accessCount": 0
}
```

---

### ▶️ Get All URLs

**GET /urls**
```json
[
  {
  "id": 1,
  "shortCode": "aB9dEfkT24",
  "url": "https://google.com",
  "accessCount": 3
  },
  {
  "id": 2,
  "shortCode": "test",
  "url": "https://youtube.com",
  "accessCount": 4
  },
]
```

### ▶️ Get URL by shortCode

**GET /urls/:shortCode**

### Response:

```json
{
  "id": 1,
  "shortCode": "aB9dEfkT24",
  "url": "https://google.com",
  "accessCount": 3
}
```

---

### 🔁 Redirect to original URL

**GET /urls/r/:shortCode**

Redirects using:

✔ Cache (Memory → Redis)
✔ DB fallback
✔ Increments access count

---

### 📈 Get stats

**GET /urls/:shortCode/stats**

Same as `findOne` but used for analytics.

---

### ✏ Update URL

**PATCH /urls/:shortCode**

### Request:

```json
{
  "url": "https://updated.com"
}
```

---

### ❌ Delete URL

**DELETE /urls/:shortCode**

### Response:

```json
{
  "message": "Deleted successfully"
}
```

## ⚡ Caching

This project uses **Redis** for caching:

* Shared between instances
* Great for distributed systems

### Cache Flow

```
GET shortCode →
  Redis Hit → store to Memory → return
  DB Hit → store to Redis + Memory → return
  Not found → throw 404
```

