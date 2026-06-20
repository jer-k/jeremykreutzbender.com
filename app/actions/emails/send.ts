"use server";

import type { ErrorResponse } from "resend";

import { ContactEmail } from "@/components/email_templates/contact-email";
import { getResend } from "@/lib/resend";
import { ContactSchemaValues } from "@/lib/schemas/contact-form-schema";

type SendEmailResponse = {
  error?: ErrorResponse;
};

export async function sendEmail(
  formData: ContactSchemaValues,
): Promise<SendEmailResponse> {
  const { fullName, emailAddress, message } = formData;
  const from = process.env.MY_RESEND_ADDRESS;
  const to = process.env.MY_EMAIL_ADDRESS;
  const resend = getResend();

  if (!from || !to || !resend) {
    return {
      error: {
        name: "missing_required_field",
        message:
          "RESEND_API_KEY, MY_RESEND_ADDRESS, and MY_EMAIL_ADDRESS must be configured to send contact emails.",
      },
    };
  }

  const data = await resend.emails.send({
    from,
    to,
    subject: `${fullName} Contacted You`,
    react: ContactEmail({ fullName, emailAddress, message }),
  });

  if (data.error) {
    return { error: data.error };
  } else {
    return {};
  }
}
