import { Hono } from "hono";
import { Resend } from "resend";

const contact = new Hono();

contact.post("/", async (c) => {
  const body = await c.req.json<{
    name: string;
    email: string;
    phone?: string;
    company?: string;
    service?: string;
    message: string;
  }>();

  if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
    return c.json({ error: "Name, email, and message are required." }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY missing; contact form submission logged only.");
    console.info("Contact submission", body);
    return c.json({ success: true });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "Novaflow Website <onboarding@resend.dev>",
    to: ["hello@novaflow.co.ke"],
    replyTo: body.email,
    subject: `Website contact from ${body.name}`,
    text: [
      `Name: ${body.name}`,
      `Email: ${body.email}`,
      `Phone: ${body.phone ?? ""}`,
      `Company: ${body.company ?? ""}`,
      `Service interest: ${body.service ?? ""}`,
      "",
      body.message,
    ].join("\n"),
  });

  if (error) {
    console.error(error);
    return c.json({ error: "Could not send message. Try again later." }, 500);
  }

  return c.json({ success: true });
});

export { contact as contactRoutes };
