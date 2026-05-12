import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.mapFeaturedCounty.deleteMany();
  await prisma.impactStat.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.service.deleteMany();
  await prisma.communityStory.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.clientLogo.deleteMany();
  await prisma.job.deleteMany();
  await prisma.post.deleteMany();

  await prisma.mapFeaturedCounty.create({
    data: {
      countyName: "Nakuru County",
      statusLabel: "Connected",
      description:
        "An active operating county with free WiFi at schools, dispensaries and community hotspots — and an expanding rollout.",
      schoolsCount: 5,
      dispensariesCount: 2,
      communityHotspots: 3,
    },
  });

  await prisma.impactStat.createMany({
    data: [
      { label: "Schools Connected", value: 47, sortOrder: 0 },
      { label: "Dispensaries Online", value: 12, sortOrder: 1 },
      { label: "Police Stations Online", value: 8, sortOrder: 2 },
      { label: "Counties Served", value: 3, sortOrder: 3 },
      { label: "Businesses Powered", value: 250, sortOrder: 4 },
      { label: "Network Uptime", value: 99, sortOrder: 5 },
    ],
  });

  const isp = await prisma.service.create({
    data: {
      name: "ISP Billing System",
      slug: "isp-billing",
      tagline: "Complete billing, CRM and customer management for ISPs of all sizes.",
      description:
        "End-to-end subscriber billing, payments, and reporting tailored for internet service providers across Kenya.",
      category: "SOFTWARE",
      icon: "layers",
      features: JSON.stringify([
        "Automated billing",
        "M-Pesa & card payments",
        "Network management",
        "Customer self-service portal",
      ]),
      pricingType: "FIXED",
      plans: {
        create: [
          {
            name: "Starter",
            priceKes: 2500,
            interval: "MONTHLY",
            isPopular: false,
            features: JSON.stringify([
              "Up to 500 subscribers",
              "Basic reports",
              "Email support",
              "M-Pesa integration",
            ]),
          },
          {
            name: "Professional",
            priceKes: 6000,
            interval: "MONTHLY",
            isPopular: true,
            features: JSON.stringify([
              "Up to 5,000 subscribers",
              "Advanced reports",
              "Priority support",
              "API access",
              "Multi-user accounts",
            ]),
          },
          {
            name: "Enterprise",
            priceKes: 16500,
            interval: "MONTHLY",
            isPopular: false,
            features: JSON.stringify([
              "Unlimited subscribers",
              "Custom integrations",
              "Dedicated success manager",
              "24/7 support",
              "On-premise option",
            ]),
          },
        ],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: "Retail POS",
      slug: "retail-pos",
      tagline: "Modern POS for retail shops and supermarkets — online or offline.",
      description: "Point of sale for shops and supermarkets with inventory, receipts, and reporting.",
      category: "SOFTWARE",
      icon: "shopping-cart",
      features: JSON.stringify([
        "Sales & inventory",
        "Multi-branch",
        "Offline mode",
        "Reports & analytics",
      ]),
      pricingType: "FIXED",
      plans: {
        create: [
          {
            name: "Perpetual License",
            priceKes: 45000,
            interval: "MONTHLY",
            isPopular: true,
            features: JSON.stringify([
              "One-time payment",
              "Per terminal license",
              "1 year free updates",
              "Email support",
              "Self-hosted",
            ]),
          },
        ],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: "Pharmacy POS",
      slug: "pharmacy-pos",
      tagline: "Specialised POS for pharmacies and clinics.",
      description: "Stock control, prescription management, and NHIF integration for Kenyan pharmacies.",
      category: "SOFTWARE",
      icon: "pill",
      features: JSON.stringify([
        "Prescription management",
        "Stock & batch tracking",
        "NHIF integration",
        "Expiry alerts",
      ]),
      pricingType: "FIXED",
    },
  });

  await prisma.service.create({
    data: {
      name: "WhatsApp API",
      slug: "whatsapp-api",
      tagline: "Connect, automate and engage customers at scale.",
      description: "Official WhatsApp Business API integration for support, sales, and notifications.",
      category: "AUTOMATION",
      icon: "message",
      features: JSON.stringify([
        "Automated messaging",
        "Chatbot integration",
        "Broadcast campaigns",
        "Customer support inbox",
      ]),
      pricingType: "CUSTOM",
    },
  });

  await prisma.service.create({
    data: {
      name: "AI Automation",
      slug: "ai-automation",
      tagline: "Automate workflows and grow faster with practical AI.",
      description: "WhatsApp bots, document processing, and custom AI automations for African businesses.",
      category: "AUTOMATION",
      icon: "cpu",
      features: JSON.stringify([
        "Workflow automation",
        "Document AI / OCR",
        "Smart chatbots",
        "Custom integrations",
      ]),
      pricingType: "CUSTOM",
    },
  });

  await prisma.service.create({
    data: {
      name: "IoT Solutions",
      slug: "iot-solutions",
      tagline: "Smart devices and sensors for new ways of working.",
      description: "Monitoring, metering, and smart infrastructure integrated with your stack.",
      category: "IOT",
      icon: "wifi",
      features: JSON.stringify([
        "Device provisioning",
        "Real-time dashboards",
        "Remote monitoring",
        "Alerts & SMS",
      ]),
      pricingType: "CUSTOM",
    },
  });

  await prisma.service.create({
    data: {
      name: "Rural Connectivity",
      slug: "rural-connectivity",
      tagline: "Internet where it matters most.",
      description: "Installation and network management for underserved communities and public institutions.",
      category: "CONNECTIVITY",
      icon: "tower",
      features: JSON.stringify([
        "Site surveys",
        "Backhaul deployment",
        "Free WiFi installation",
        "24/7 NOC support",
      ]),
      pricingType: "CUSTOM",
    },
  });

  await prisma.communityStory.createMany({
    data: [
      {
        title: "From isolation to opportunity in Narok",
        slug: "from-isolation-to-opportunity-narok",
        location: "Narok",
        county: "Narok",
        excerpt: "A youth centre with a single laptop becomes a digital learning hub for over 200 students every week.",
        content:
          "## Impact\n\nWe partnered with the Narok youth centre to install free WiFi and re-purpose donated devices. Over 200 students now study online, register for exams, and access scholarships.\n\n## Outcomes\n\nAttendance is up, and three students secured digital skills internships in their first term.",
        category: "SCHOOLS",
        beneficiary: "Narok Youth Hub",
        coverImage:
          "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200&q=80",
        published: true,
      },
      {
        title: "Digital learning transformation in Kilifi",
        slug: "digital-learning-transformation-kilifi",
        location: "Kilifi",
        county: "Kilifi",
        excerpt: "Students at a coastal secondary school access digital learning resources for the first time.",
        content:
          "## Impact\n\nOur team installed connectivity at a rural secondary school, enabling teachers to use digital content and students to complete assignments online.\n\n## Outcomes\n\nAttendance improved and exam readiness scores increased term over term.",
        category: "SCHOOLS",
        beneficiary: "Kilifi Secondary School",
        coverImage:
          "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80",
        published: true,
      },
      {
        title: "Better healthcare in Turkana",
        slug: "better-healthcare-turkana",
        location: "Turkana",
        county: "Turkana",
        excerpt: "A remote dispensary can now sync patient records and order medicine in real-time.",
        content:
          "## Impact\n\nFree connectivity allows the dispensary to use cloud health tools, dramatically reducing patient wait times and stock-outs.",
        category: "DISPENSARIES",
        beneficiary: "Turkana Rural Dispensary",
        coverImage:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
        published: true,
      },
    ],
  });

  await prisma.teamMember.createMany({
    data: [
      {
        name: "Amina Kimani",
        role: "CEO & Co-founder",
        bio: "Building connectivity and software for Kenya's next decade.",
        sortOrder: 0,
        linkedin: "https://linkedin.com",
      },
      {
        name: "David Ochieng",
        role: "Head of Engineering",
        bio: "Leads platform architecture and security.",
        sortOrder: 1,
        linkedin: "https://linkedin.com",
      },
    ],
  });

  await prisma.testimonial.createMany({
    data: [
      {
        clientName: "James Mwangi",
        clientRole: "ISP Owner",
        company: "Highland Networks",
        content:
          "Novaflow's ISP Billing System has transformed how we manage our operations and customers.",
        rating: 5,
        featured: true,
      },
      {
        clientName: "Grace Wanjiku",
        clientRole: "Head Teacher",
        company: "Kilifi Secondary",
        content:
          "The free WiFi in our school has changed nearly a week's worth of learning for our students.",
        rating: 5,
        featured: true,
      },
      {
        clientName: "Dr. Peter Otieno",
        clientRole: "In-Charge",
        company: "Turkana Dispensary",
        content:
          "Their connectivity solution helps us serve patients and communities better.",
        rating: 5,
        featured: true,
      },
    ],
  });

  await prisma.clientLogo.createMany({
    data: [
      { name: "Safaricom", logoUrl: "https://picsum.photos/seed/safaricom/200/60", sortOrder: 0, stripKind: "TRUSTED_BY" },
      { name: "Telkom", logoUrl: "https://picsum.photos/seed/telkom/200/60", sortOrder: 1, stripKind: "TRUSTED_BY" },
      { name: "Kenya Red Cross", logoUrl: "https://picsum.photos/seed/redcross/200/60", sortOrder: 2, stripKind: "TRUSTED_BY" },
      { name: "World Vision", logoUrl: "https://picsum.photos/seed/worldvision/200/60", sortOrder: 3, stripKind: "TRUSTED_BY" },
      { name: "BRCK", logoUrl: "https://picsum.photos/seed/brck/200/60", sortOrder: 4, stripKind: "TRUSTED_BY" },
      {
        name: "Sample Enterprise",
        logoUrl: "https://picsum.photos/seed/enterprise-a/200/60",
        sortOrder: 0,
        stripKind: "SOFTWARE_CUSTOMERS",
      },
      {
        name: "Sample Retail Group",
        logoUrl: "https://picsum.photos/seed/enterprise-b/200/60",
        sortOrder: 1,
        stripKind: "SOFTWARE_CUSTOMERS",
      },
    ],
  });

  await prisma.job.createMany({
    data: [
      {
        title: "Senior Full-Stack Engineer",
        slug: "senior-full-stack-engineer",
        department: "Engineering",
        location: "Nairobi / Hybrid",
        type: "FULL_TIME",
        experience: "5+ years",
        description: "Build the Novaflow platform and integrations.",
        requirements: JSON.stringify(["TypeScript", "React", "Node", "SQL"]),
        benefits: JSON.stringify(["Health cover", "Learning budget"]),
        salary: "Competitive",
        published: true,
        closingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    ],
  });

  await prisma.post.createMany({
    data: [
      {
        title: "Why rural connectivity is national infrastructure",
        slug: "rural-connectivity-national-infrastructure",
        excerpt: "Connecting schools and clinics is not optional—it is foundational.",
        content: "Full article body here.",
        category: "Impact",
        tags: JSON.stringify(["connectivity", "policy"]),
        published: true,
        coverImage:
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
      },
      {
        title: "Introducing smarter ISP billing",
        slug: "smarter-isp-billing",
        excerpt: "What we learned billing thousands of subscribers across Kenya.",
        content: "Full article body here.",
        category: "Product",
        tags: JSON.stringify(["isp", "billing"]),
        published: true,
      },
    ],
  });

  const bcrypt = (await import("bcryptjs")).default;
  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? "changeme", 10);
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? "admin@novaflow.co.ke" },
    update: { passwordHash: hash },
    create: {
      email: process.env.ADMIN_EMAIL ?? "admin@novaflow.co.ke",
      passwordHash: hash,
    },
  });

  console.log("Seed complete", { ispId: isp.id });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
