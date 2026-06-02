/* src/lib/email.ts */
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM || "Zygnal Astro <ritual@zygnalastro.com>";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendReportAccessEmail(to: string, reportLink: string, token: string) {
  if (!resend) {
    console.log("=========================================");
    console.log(`[MOCK EMAIL] TO: ${to}`);
    console.log(`[MOCK EMAIL] SUBJECT: Your Celestial Blueprint is Ready`);
    console.log(`[MOCK EMAIL] BODY: Access your report here: ${reportLink}`);
    console.log("=========================================");
    return;
  }

  try {
    await resend.emails.send({
      from: emailFrom,
      to,
      subject: "Your Celestial Blueprint is Ready | Zygnal Astro",
      html: `
        <div style="font-family: serif; max-width: 600px; margin: auto; padding: 20px; background-color: #000; color: #fff; border: 1px solid #d4af37; border-radius: 12px;">
          <h1 style="color: #d4af37; text-align: center; letter-spacing: 2px;">ZYGNAL ASTRO</h1>
          <hr style="border-color: #d4af37; opacity: 0.3;" />
          <p style="font-size: 16px; line-height: 1.6; color: #ccc;">
            Greetings Explorer,
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #ccc;">
            Your personal planetary alignment analysis has completed. Your cosmic blueprint is now permanently written into the records.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${reportLink}" style="background-color: #d4af37; color: #000; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 6px; letter-spacing: 1px;">
              ACCESS YOUR BLUEPRINT
            </a>
          </div>
          <p style="font-size: 12px; color: #555; text-align: center;">
            Report Token: ${token} <br />
            To retrieve this report at any time, bookmark this link. Zero logins required.
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send report access email via Resend:", err);
    throw err;
  }
}
