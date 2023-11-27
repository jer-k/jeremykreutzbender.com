"use client"

import {useForm, SubmitHandler} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import * as zod from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useToast} from "@/components/ui/use-toast"

import {sendEmail} from "@/app/actions/contact";
import {contactSchema} from "@/lib/schemas/contact-form-schema";

type ContactSchemaValues = zod.infer<typeof contactSchema>

export function ContactForm() {
  const {toast} = useToast()

  const form = useForm<ContactSchemaValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      emailAddress: "",
      message: ""
    },
  })
  const {control, handleSubmit, reset, formState: {isSubmitting}} = form;

  const onSubmit: SubmitHandler<ContactSchemaValues> = async (data: ContactSchemaValues) => {
    const result = await sendEmail(data);
    if (!result.error) {
      toast({
        description: "Email sent to Jeremy!",
      })
      reset();
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem sending your email.",
      })
    }
  }

  return (
    <Form {...form}>
      <form id="contact-form" className="w-2/3 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name" aria-required={true}>Name</FormLabel>
              <FormControl>
                <Input required id="name" placeholder="Enter your name" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="emailAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email" aria-required={true}>Email</FormLabel>
              <FormControl>
                <Input
                  required
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="message" aria-required={true}>Message</FormLabel>
              <FormControl>
                <Textarea
                  required
                  className="min-h-[100px]"
                  id="message"
                  placeholder="Enter your message"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button form="contact-form" type="submit" aria-disabled={isSubmitting}>
          Send
        </Button>
      </form>
    </Form>

  )
}