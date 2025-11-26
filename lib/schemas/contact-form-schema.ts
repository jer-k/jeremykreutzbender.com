import * as zod from "zod";

import { nonempty } from "@/lib/zod/nonempty";

export const contactSchema = zod.object({
  fullName: zod.string().pipe(nonempty()),
  emailAddress: zod.email().pipe(nonempty()),
  message: zod
    .string()
    .pipe(nonempty(6, "Message must be thoughtful and at least 6 characters")),
});

export type ContactSchemaValues = zod.infer<typeof contactSchema>;
