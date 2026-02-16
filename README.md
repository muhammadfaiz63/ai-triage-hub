# AI Support Triage Hub

An asynchronous AI-powered support triage system built with:

- **Backend:** Express (Node.js)
- **Queue:** Redis + BullMQ
- **Database:** PostgreSQL (Prisma 7)
- **AI Provider:** OpenAI
- **Frontend:** Next.js (App Router + Tailwind)

This project demonstrates how to build a production-minded MVP that integrates Generative AI with proper background processing, validation, and failure handling.

---

## 🚀 Project Objective

Build a system that:

1. Accepts user support complaints via API.
2. Processes AI triage asynchronously (non-blocking).
3. Categorizes, scores sentiment & urgency.
4. Generates a ready-to-send draft response.
5. Allows agents to review and resolve tickets via dashboard.

---

## 🏗 Architecture Overview

User / Client -> POST /tickets -> Express API (returns 201 immediately) -> Redis Queue (BullMQ) -> Background Worker
-> OpenAI API -> PostgreSQL (Prisma)

### Key Design Principle:

> AI processing must NOT block the HTTP response.

The system ensures immediate API response while AI processing happens in a separate worker process.

---

## 🧠 Engineering Decisions

### 1️⃣ Asynchronous Processing

AI calls take 3–5 seconds.  
To prevent blocking requests:

- Tickets are stored with `PENDING` status.
- A job is pushed to Redis.
- A separate worker processes the AI task.

This ensures scalability and better UX.

---

### 2️⃣ Background Worker Isolation

AI processing runs in a dedicated worker process using BullMQ.

Status flow:

PENDING → PROCESSING → READY → RESOLVED
↘ FAILED

This separation:

- Prevents API slowdowns
- Improves reliability
- Allows retry strategies

---

### 3️⃣ Strict AI Output Validation

AI responses are validated using a Zod schema.

The system:

- Cleans markdown artifacts (```json blocks)
- Parses JSON safely
- Validates required fields
- Fails gracefully if malformed

If validation fails:

- Ticket status becomes `FAILED`
- Error reason is stored in the database

This prevents unsafe or corrupted AI outputs from being persisted.

---

### 4️⃣ Error Handling & Failure Safety

The worker:

- Catches runtime exceptions
- Marks tickets as `FAILED`
- Stores error messages

The system never crashes due to malformed AI output.

---

### 5️⃣ Retry Strategy

Queue jobs are configured with retry attempts and exponential backoff to handle temporary failures (e.g., network/API issues).

---

### 6️⃣ Prisma 7 + PostgreSQL

The project uses:

- Prisma ORM
- Prisma 7 driver adapter
- PostgreSQL

Database stores structured AI fields:

- category
- sentiment (1–10 scale)
- urgency (High/Medium/Low)
- aiDraft

This ensures AI results are stored as structured data — not plain text blobs.

---

## 🎨 Frontend (Agent Dashboard)

The dashboard allows:

- Viewing all tickets
- Filtering by status
- Visual urgency indicators
- Viewing AI-generated drafts
- Editing and resolving tickets

Color coding:

- 🔴 High urgency
- 🟡 Medium urgency
- 🟢 Low urgency

Statuses:

- PENDING
- PROCESSING
- READY
- FAILED
- RESOLVED

---

## 📝 API Endpoints

### Create Ticket

POST /tickets

Returns immediately with:

```json
{
  "id": "...",
  "status": "PENDING"
}
```

### Get Tickets

GET /tickets

GET /tickets?status=READY

### Get Ticket Detail

GET /tickets/:id

### Resolve Ticket

PATCH /tickets/:id/resolve

## Example Test Cases

```
Billing Issue (High Urgency)
I was charged twice for my annual subscription and this is unacceptable.

Technical Issue
The dashboard keeps loading indefinitely when I try to upload a file.

Feature Request
It would be great if you could add dark mode support.
```
