import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend) {
    console.warn("Resend not configured. Email not sent.");
    return null;
  }

  try {
    const result = await resend.emails.send({
      from: "UniConnect <noreply@uniconnect.pk>",
      to,
      subject,
      html,
    });
    return result;
  } catch (error) {
    console.error("Failed to send email:", error);
    return null;
  }
}

export async function sendApplicationConfirmation(
  email: string,
  name: string,
  programName: string,
  universityName: string,
) {
  return sendEmail({
    to: email,
    subject: "Application Submitted - UniConnect",
    html: `
      <h1>Application Submitted</h1>
      <p>Dear ${name},</p>
      <p>Your application for <strong>${programName}</strong> at <strong>${universityName}</strong> has been submitted successfully.</p>
      <p>You will receive updates about your application status via email.</p>
      <p>Best regards,<br/>UniConnect Team</p>
    `,
  });
}
