import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";

// Middleware to verify admin JWT
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Public: list events
app.get("/api/events", async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
    });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// Public: event details
app.get("/api/events/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const event = await prisma.event.findUnique({
      where: { id },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch event" });
  }
});

// Public: register for event
app.post("/api/events/:id/register", async (req, res) => {
  const eventId = Number(req.params.id);
  const { name, email, phone } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Ensure email unique per event
    const existing = await prisma.registration.findUnique({
      where: { email_eventId: { email, eventId } },
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "You have already registered for this event" });
    }

    const registration = await prisma.registration.create({
      data: {
        name,
        email,
        event: { connect: { id: eventId } },
      },
    });

    res.status(201).json(registration);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to register for event" });
  }
});

// Admin: login
app.post("/api/admin/login", async (req, res) => {
  // Validate and normalize input
  let { email, password } = req.body || {};
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Email and password are required" });
  }

  email = email.trim().toLowerCase();

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || typeof admin.password !== "string") {
      // Avoid exposing which part failed
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

// Admin: add event
app.post("/api/admin/events", authenticateAdmin, async (req, res) => {
  const { title, description, date, location, capacity, imageUrl } = req.body;
  if (!title || !description || !date || !location || !imageUrl) {
    return res.status(400).json({
      message: "Title, description, date, location, and imageUrl are required",
    });
  }

  // Validate date format
  const eventDate = new Date(date);
  if (isNaN(eventDate.getTime())) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: eventDate,
        location,
        capacity: capacity ?? null,
        imageUrl,
      },
    });
    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create event" });
  }
});

// Admin: update event
app.put("/api/admin/events/:id", authenticateAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { title, description, date, location, capacity, imageUrl } = req.body;

  try {
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        description: description ?? existing.description,
        date: date ? new Date(date) : existing.date,
        location: location ?? existing.location,
        capacity: capacity ?? existing.capacity,
        imageUrl: imageUrl ?? existing.imageUrl,
      },
    });
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update event" });
  }
});

// Admin: delete event
app.delete("/api/admin/events/:id", authenticateAdmin, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "Event not found" });
    }
    await prisma.event.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete event" });
  }
});

// Admin: view registrations
app.get("/api/admin/registrations", authenticateAdmin, async (req, res) => {
  try {
    const registrations = await prisma.registration.findMany({
      include: { event: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(registrations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
