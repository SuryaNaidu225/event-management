1. Introduction
   1.1 Purpose

The Event/Workshop Management System enables users to browse upcoming events, view details, and register. Administrators can manage events and view registrations through a dedicated dashboard.

1.2 Target Users

User (Attendee)
Anyone who wants to view and register for events.

Admin
Can create, update, delete events and view event registrations.

1.3 Tech Stack
Component Technology
Frontend React.js, Tailwind CSS
Backend Node.js, Express.js
Database SQLite
ORM Prisma
Authentication (optional) JWT
Deployment Vercel/Netlify (frontend), Render/Railway (backend) 2. System Overview

The system has two main modules:

User Side (Public)

View upcoming events

View event details

Register for an event

Admin Dashboard

Admin login

Add / Update / Delete events

View list of all registrations

3. Functional Requirements
   3.1 User Module
   3.1.1 View Events

Description: Users can view a list of upcoming events.
Features:

Event title

Date & time

Venue / mode (online/offline)

Description (short)

Pagination

API:
GET /api/events

3.1.2 View Event Details

Description: When clicking on an event, the user sees the full details.
Fields:

Title

Description (long)

Date & Time

Speaker / Host

Max seats (optional)

API:
GET /api/events/:id

3.1.3 Register for Event

Description: Users submit their information to register.
User fields:

Name

Email

Phone number (optional)

API:
POST /api/events/:id/register

Validations:

Email must be unique per event

Required fields must be filled

3.2 Admin Module
3.2.1 Admin Login

Description: Secure login for admin.
Fields:

Email

Password

API:
POST /api/admin/login

Output: JWT token

3.2.2 Add Event

Description: Admin adds new event details.
Fields:

Title

Description

Date & Time

Location

Capacity (optional)

API:
POST /api/admin/events

3.2.3 Update Event

Description: Admin can update any event.
API:
PUT /api/admin/events/:id

3.2.4 Delete Event

Description: Admin can delete an event.
API:
DELETE /api/admin/events/:id

3.2.5 View Registrations

Description: Admin can see who registered for which event.
API:
GET /api/admin/registrations

4. Non-Functional Requirements (NFRs)
   4.1 Performance

API response time < 200ms

Event list loads instantly due to SQLite's speed

4.2 Security

JWT-based admin auth

Password hashing using bcrypt

No admin access without token

4.3 Reliability

SQLite ensures stable local development and low-maintenance environments.

4.4 Usability

Clean UI using Tailwind

Responsive across mobile, tablet, laptop

5. System Architecture

Frontend → Backend → Database

React + Tailwind → Express.js API → Prisma ORM → SQLite

6. Database Schema (Prisma)
   6.1 Event Model
   model Event {
   id Int @id @default(autoincrement())
   title String
   description String
   date DateTime
   location String
   capacity Int?
   registrations Registration[]
   createdAt DateTime @default(now())
   }

6.2 Registration Model
model Registration {
id Int @id @default(autoincrement())
name String
email String
eventId Int
event Event @relation(fields: [eventId], references: [id])
createdAt DateTime @default(now())
}

6.3 Admin Model
model Admin {
id Int @id @default(autoincrement())
email String @unique
password String
createdAt DateTime @default(now())
}

## Vercel deployment notes

- Frontend uses the `VITE_API_BASE_URL` environment variable (Vite) to determine the API base URL.
- In production on Vercel set `VITE_API_BASE_URL` to your backend URL (e.g. `https://your-backend.example.com`).
- If your backend is served from the same origin as the frontend (e.g. backend deployed as Vercel Serverless Functions under `/api`), set `VITE_API_BASE_URL` to an empty string or omit it — the app will fall back to the same origin.
- Ensure backend environment variables like `DATABASE_URL` and `JWT_SECRET` are configured in your backend deployment.

Example Vercel env settings:

`VITE_API_BASE_URL` = `https://your-backend.example.com` // or empty for same-origin 7. API Endpoints Summary
User API
Method Endpoint Description
GET /api/events List all events
GET /api/events/:id Event details
POST /api/events/:id/register Register for event
Admin API
Method Endpoint Description
POST /api/admin/login Admin login
POST /api/admin/events Add event
PUT /api/admin/events/:id Update event
DELETE /api/admin/events/:id Delete event
GET /api/admin/registrations View registrations 8. UI/UX Requirements
User Screens

Home (list of events)

Event details

Registration form

Success page

Admin Screens

Login

Dashboard

Create event

Edit event

Registration list

9. Future Enhancements (Optional)

Event analytics (no. of registrations)

Multiple admin roles

Payment gateway integration

Email notifications

QR-code based check-in system
