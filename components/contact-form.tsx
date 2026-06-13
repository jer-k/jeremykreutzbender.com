"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { processContactForm } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ContactSchemaValues,
  contactSchema,
} from "@/lib/schemas/contact-form-schema";

export function ContactForm() {
  const form = useForm<ContactSchemaValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      emailAddress: "",
      message: "",
    },
  });
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<ContactSchemaValues> = async (
    data: ContactSchemaValues,
  ) => {
    const result = await processContactForm(data);
    if (!(result.emailError || result.formErrors)) {
      toast("Email sent to Jeremy!");
      reset();
    } else {
      if (result.formErrors) {
        const keys = Object.keys(result.formErrors) as Array<
          keyof typeof result.formErrors
        >;
        keys.forEach((key) => {
          const message = result.formErrors?.[key];
          if (message) {
            setError(key, { message: message });
          }
        });
      }
      toast.warning("Uh oh! Something went wrong.", {
        description: "There was a problem sending your email.",
      });
    }
  };

  return (
    <form
      id="contact-form"
      className="space-y-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        control={control}
        name="fullName"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="fullName">Name</FieldLabel>
            <Input
              {...field}
              id="fullName"
              placeholder="Enter your name"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={control}
        name="emailAddress"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              {...field}
              id="email"
              placeholder="Enter your email"
              type="email"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={control}
        name="message"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="message">Message</FieldLabel>
            <Textarea
              {...field}
              className="min-h-25"
              id="message"
              placeholder="Enter your message"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button form="contact-form" type="submit" aria-disabled={isSubmitting}>
        Send
      </Button>
    </form>
  );
}
