import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

// Use Vite environment variable when available (set `VITE_API_BASE_URL` in Vercel).
// If not provided, fall back to localhost for local dev.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-transparent">
      <header className="border-b border-white/70 bg-white/80 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-semibold text-ink">
            Event & Workshop Hub
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/" className="text-ink/70 transition hover:text-ink">
              Events
            </Link>
            <Link
              to="/admin/login"
              className="rounded-full bg-blush-500 px-4 py-1.5 text-white shadow-md transition hover:bg-blush-400"
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
    </div>
  );
}

function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/events`);
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <Layout>
      <div className="mb-8 space-y-2 text-center md:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/70">
          Discover
        </p>
        <h1 className="text-3xl font-semibold text-ink">Upcoming Events</h1>
        <p className="text-sm text-ink/70">
          Bright, inspiring sessions to keep your learning journey colorful.
        </p>
      </div>
      {loading ? (
        <p className="text-ink/70">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-ink/70">No events available right now.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="group flex flex-col rounded-2xl border border-white/70 bg-white/80 p-5 shadow-floating transition hover:-translate-y-1 hover:bg-white"
            >
              {event.imageUrl && (
                <div className="relative mb-4 overflow-hidden rounded-xl">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute left-3 top-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-ink">
                    Featured
                  </span>
                </div>
              )}
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-ink/70">
                <span className="rounded-full bg-peach-50 px-3 py-1 text-peach-500">
                  {new Date(event.date).toLocaleString()}
                </span>
                <span className="rounded-full bg-mint-50 px-3 py-1 text-mint-500">
                  {event.location}
                </span>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-ink">
                {event.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm text-ink/70">
                {event.description}
              </p>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
}

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <p className="text-ink/70">Loading event...</p>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <p className="text-ink/70">Event not found.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm font-medium text-ink/70 transition hover:text-ink"
      >
        &larr; Back
      </button>
      <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-floating">
        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="mb-5 h-64 w-full rounded-2xl object-cover"
          />
        )}
        <h1 className="mb-2 text-3xl font-semibold text-ink">{event.title}</h1>
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-ink/70">
          <span className="rounded-full bg-peach-50 px-3 py-1 text-peach-500">
            {new Date(event.date).toLocaleString()}
          </span>
          <span className="rounded-full bg-mint-50 px-3 py-1 text-mint-500">
            {event.location}
          </span>
          {event.capacity && (
            <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-400">
              {event.capacity} seats
            </span>
          )}
        </div>
        <p className="mt-4 text-ink/80">{event.description}</p>
        <div className="mt-6">
          <Link
            to={`/events/${event.id}/register`}
            className="inline-flex items-center rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blush-500"
          >
            Register
          </Link>
        </div>
      </div>
    </Layout>
  );
}

function EventRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!name || !email) {
      setError("Name and email are required");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/api/events/${id}/register`, {
        name,
        email,
      });
      navigate("/success");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm font-medium text-ink/70 transition hover:text-ink"
      >
        &larr; Back
      </button>
      <div className="mx-auto max-w-md rounded-3xl border border-white/70 bg-white/80 p-6 shadow-floating backdrop-blur">
        <h1 className="mb-4 text-2xl font-semibold text-ink">
          Register for Event
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink/80">
              Name
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-ink focus:border-blush-400 focus:outline-none focus:ring-2 focus:ring-blush-100"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink/80">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-ink focus:border-blush-400 focus:outline-none focus:ring-2 focus:ring-blush-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-blush-500">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blush-500 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Registration"}
          </button>
        </form>
      </div>
    </Layout>
  );
}

function SuccessPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-md rounded-3xl border border-white/70 bg-white/80 p-6 text-center shadow-floating">
        <h1 className="mb-2 text-2xl font-semibold text-ink">
          Registration Successful
        </h1>
        <p className="text-sm text-ink/70">
          You will receive further details from the organizers.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blush-500"
        >
          Back to Events
        </Link>
      </div>
    </Layout>
  );
}

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/admin/login`, {
        email,
        password,
      });
      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-md rounded-3xl border border-white/70 bg-white/80 p-6 shadow-floating">
        <h1 className="mb-4 text-2xl font-semibold text-ink">Admin Login</h1>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink/80">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-ink focus:border-lavender-400 focus:outline-none focus:ring-2 focus:ring-lavender-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink/80">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-ink focus:border-lavender-400 focus:outline-none focus:ring-2 focus:ring-lavender-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-blush-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blush-500 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </Layout>
  );
}

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");
  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (!token) return;
    async function fetchData() {
      try {
        const [eventsRes, regsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/events`),
          axios.get(`${API_BASE_URL}/api/admin/registrations`, authHeaders),
        ]);
        setEvents(eventsRes.data);
        setRegistrations(regsRes.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [token]);

  async function handleCreateEvent(e) {
    e.preventDefault();
    setError("");
    if (!title || !description || !date || !location || !imageUrl) {
      setError(
        "Title, description, date, location, and image URL are required"
      );
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/admin/events`,
        {
          title,
          description,
          date,
          location,
          capacity: capacity ? Number(capacity) : null,
          imageUrl,
        },
        authHeaders
      );
      setEvents((prev) => [...prev, res.data]);
      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");
      setCapacity("");
      setImageUrl("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create event");
    }
  }

  async function handleDeleteEvent(id) {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/events/${id}`, authHeaders);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  }

  if (!token) {
    return (
      <Layout>
        <p className="text-ink/70">
          You must{" "}
          <Link
            to="/admin/login"
            className="text-ink underline decoration-blush-400"
          >
            log in
          </Link>{" "}
          as admin to view the dashboard.
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid gap-8 md:grid-cols-[2fr,1.5fr]">
        <section className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/60">
              Admin Studio
            </p>
            <h1 className="text-2xl font-semibold text-ink">Manage Events</h1>
            <p className="text-sm text-ink/70">
              Keep the lineup fresh with a splash of color in every session.
            </p>
          </div>
          <form
            className="space-y-3 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-floating"
            onSubmit={handleCreateEvent}
          >
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-ink/70">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-ink focus:border-mint-400 focus:outline-none focus:ring-2 focus:ring-mint-100"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink/70">
                  Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-ink focus:border-mint-400 focus:outline-none focus:ring-2 focus:ring-mint-100"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink/70">
                  Location
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-ink focus:border-mint-400 focus:outline-none focus:ring-2 focus:ring-mint-100"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink/70">
                  Capacity (optional)
                </label>
                <input
                  type="number"
                  className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-ink focus:border-mint-400 focus:outline-none focus:ring-2 focus:ring-mint-100"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-medium text-ink/70">
                  Image URL
                </label>
                <input
                  type="url"
                  className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-ink focus:border-mint-400 focus:outline-none focus:ring-2 focus:ring-mint-100"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink/70">
                Description
              </label>
              <textarea
                className="min-h-[80px] w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-ink focus:border-mint-400 focus:outline-none focus:ring-2 focus:ring-mint-100"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-blush-500">{error}</p>}
            <button
              type="submit"
              className="inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blush-500"
            >
              Add Event
            </button>
          </form>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/60">
              All Events
            </h2>
            <div className="space-y-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 p-4 text-sm shadow-floating"
                >
                  <div>
                    <p className="font-medium text-ink">{event.title}</p>
                    <p className="text-xs text-ink/60">
                      {new Date(event.date).toLocaleString()} • {event.location}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="text-xs font-medium text-blush-500 hover:text-blush-400"
                  >
                    Delete
                  </button>
                </div>
              ))}
              {events.length === 0 && (
                <p className="text-sm text-ink/60">
                  No events yet. Create one above.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/60">
            Registrations
          </h2>
          <div className="space-y-2 rounded-3xl border border-white/70 bg-white/80 p-4 text-sm shadow-floating">
            {registrations.length === 0 ? (
              <p className="text-ink/60">No registrations yet.</p>
            ) : (
              registrations.map((reg) => (
                <div
                  key={reg.id}
                  className="flex flex-col rounded-2xl border border-white/70 bg-sand/60 p-3"
                >
                  <p className="font-medium text-ink">{reg.name}</p>
                  <p className="text-xs text-ink/70">{reg.email}</p>
                  <p className="mt-1 text-xs text-ink/60">
                    Event: {reg.event?.title} •{" "}
                    {new Date(reg.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventsList />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/events/:id/register" element={<EventRegistration />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
