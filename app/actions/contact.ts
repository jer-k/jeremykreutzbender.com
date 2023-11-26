"use server"

import { ErrorResponse } from "resend";
import * as zod from "zod";

import { ContactEmail } from "@/components/email_templates/contact-email";
import { resend } from "@/lib/resend";
import { contactSchema } from "@/lib/schemas/contact-form-schema";

type ContactSchemaValues = zod.infer<typeof contactSchema>

type SendEmailResponse = {
  error?: ErrorResponse | zod.ZodFormattedError<ContactSchemaValues>
}

export async function sendEmail(formData: ContactSchemaValues): Promise<SendEmailResponse> {
  const parsedFormData = contactSchema.safeParse(formData)
  if (parsedFormData.success) {
    const { name, emailAddress, message } = parsedFormData.data;

    const data = await resend.emails.send({
      from: process.env.MY_RESEND_ADDRESS!,
      to: [process.env.MY_EMAIL_ADDRESS!],
      subject: `${name} Contacted You`,
      react: ContactEmail({name, emailAddress, message}),
    });

    if (data.error) {
      return {error: data.error}
    } else {
      return {}
    }
  } else {
    return { error: parsedFormData.error.format()}
  }
}