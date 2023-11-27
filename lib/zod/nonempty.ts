import * as zod from "zod"

export const nonempty = (length?: number, message?: string) => zod.string()
  .transform((t) => t?.trim())
  .pipe(
    zod.string().min(length ?? 1, {message: message ?? "Must be at least 1 character"})
  )
