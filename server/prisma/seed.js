import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create default admin user
  const hashedPassword = await bcrypt.hash("suri#345", 10);

  const admin = await prisma.admin.upsert({
    where: { email: "admin@gmail.com" },
    update: {
      password: hashedPassword, // Update password if admin exists
    },
    create: {
      email: "admin@gmail.com",
      password: hashedPassword,
    },
  });

  console.log("Admin user created/updated:", admin.email);
  console.log("Admin password: suri#345");

  const events = [
    {
      title: "Web Development Bootcamp 2025",
      description:
        "Beginner-friendly bootcamp covering HTML, CSS, JavaScript & React basics. Speaker: Rajesh Kumar.",
      date: new Date("2025-01-18T10:00:00+05:30"),
      location: "Online (Zoom)",
      imageUrl: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34",
      capacity: 200,
    },
    {
      title: "Graphic Design Masterclass",
      description:
        "Learn UI/UX fundamentals, color psychology & Figma workflows. Speaker: Priya Verma.",
      date: new Date("2025-02-02T14:00:00+05:30"),
      location: "Hyderabad Design Studio",
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      capacity: 50,
    },
    {
      title: "AI & Machine Learning Workshop",
      description:
        "Covers ML algorithms, data preprocessing & real-world case studies. Speaker: Dr. Akash Babu.",
      date: new Date("2025-03-10T11:00:00+05:30"),
      location: "Online (Google Meet)",
      imageUrl: "https://images.unsplash.com/photo-1508385082359-f38ae991e8f2",
      capacity: 300,
    },
    {
      title: "Career Guidance Seminar for Students",
      description:
        "Resume building, interview prep & modern career opportunities. Speaker: HR Team (Infosys).",
      date: new Date("2025-01-25T16:00:00+05:30"),
      location: "Vijayawada – SRK Engineering College",
      imageUrl: "https://images.unsplash.com/photo-1558021211-6d1403321394",
      capacity: 500,
    },
    {
      title: "Cloud Computing with AWS Workshop",
      description:
        "Hands-on AWS training covering EC2, S3, IAM, and serverless. Speaker: Harsha Vardhan.",
      date: new Date("2025-02-15T09:30:00+05:30"),
      location: "Bengaluru – Tech Park",
      imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
      capacity: 100,
    },
    {
      title: "Cybersecurity Awareness Program",
      description:
        "Learn about cyber threats, ethical hacking basics & digital safety. Speaker: Rohan Gupta.",
      date: new Date("2025-03-05T15:00:00+05:30"),
      location: "Online Webinar",
      imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
      capacity: 150,
    },
    {
      title: "Entrepreneurship & Startup Ideation Session",
      description:
        "Build your startup idea, validate your model & pitch like a pro. Speaker: Kavya Reddy.",
      date: new Date("2025-04-01T10:00:00+05:30"),
      location: "Hyderabad Startup Incubation Hub",
      imageUrl: "https://images.unsplash.com/photo-1556761175-4b46a572b786",
      capacity: 70,
    },
    {
      title: "Data Analytics with Python Workshop",
      description:
        "Learn Python, Pandas, data cleaning & dashboard creation. Speaker: Vikram Singh.",
      date: new Date("2025-02-28T13:00:00+05:30"),
      location: "Online (MS Teams)",
      imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
      capacity: 120,
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { title: event.title },
      update: event,
      create: event,
    });
  }

  console.log(`Seeded ${events.length} events`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
