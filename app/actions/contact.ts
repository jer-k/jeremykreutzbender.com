"use server";

import { ErrorResponse } from "resend";

import { sendEmail } from "@/app/actions/emails/send";
import {
  ContactSchemaValues,
  contactSchema,
} from "@/lib/schemas/contact-form-schema";

type ProcessContactFormResponse = {
  emailError?: ErrorResponse;
  formErrors?: Partial<ContactSchemaValues>;
};

export async function processContactForm(
  formData: ContactSchemaValues,
): Promise<ProcessContactFormResponse> {
  const parsedFormData = contactSchema.safeParse(formData);
  if (parsedFormData.success) {
    const { fullName, emailAddress, message } = parsedFormData.data;

    const sendEmailResult = await sendEmail({
      fullName,
      emailAddress,
      message,
    });

    if (sendEmailResult.error) {
      return {
        emailError: sendEmailResult.error,
      };
    }

    return {};
  } else {
    const errorMap = parsedFormData.error.flatten().fieldErrors;
    return {
      formErrors: {
        fullName: errorMap["fullName"]?.[0],
        emailAddress: errorMap["emailAddress"]?.[0],
        message: errorMap["message"]?.[0],
      },
    };
  }
}
