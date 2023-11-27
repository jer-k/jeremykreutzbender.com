import * as zod from "zod";

import { nonempty } from "@/lib/zod/nonempty";

export const contactSchema = zod.object({
  name: zod.string().pipe(nonempty()),
  emailAddress: zod.string().email().pipe(nonempty()),
  message: zod.string().pipe(nonempty(6, "Message must be thoughtful and at least 6 characters")),
})
