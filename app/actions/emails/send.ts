"use server";

import { ErrorResponse } from "resend";

import { ContactEmail } from "@/components/email_templates/contact-email";
import { resend } from "@/lib/resend";
import { ContactSchemaValues } from "@/lib/schemas/contact-form-schema";

type SendEmailResponse = {
  error?: ErrorResponse;
};

export async function sendEmail(
  formData: ContactSchemaValues,
): Promise<SendEmailResponse> {
  const { fullName, emailAddress, message } = formData;

  const data = await resend.emails.send({
    from: process.env.MY_RESEND_ADDRESS!,
    to: [process.env.MY_EMAIL_ADDRESS!],
    subject: `${fullName} Contacted You`,
    react: ContactEmail({ fullName, emailAddress, message }),
  });

  if (data.error) {
    return { error: data.error };
  } else {
    return {};
  }
}
