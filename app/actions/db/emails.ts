"use server";

import { DatabaseError } from "@planetscale/database";

import { Email, emails } from "@/db/schema/emails";
import { db } from "@/lib/db";
import {
  parseDatabaseError,
  ParseDatabaseErrorResult,
} from "@/lib/db/parse-error";

type InsertEmailProps = Pick<Email, "emailAddress" | "fullName" | "message">;

type InsertEmailResponse = {
  errorMessage?: string;
  columnErrors?: ParseDatabaseErrorResult<InsertEmailProps>;
};

export async function insertEmail(
  email: InsertEmailProps,
): Promise<InsertEmailResponse> {
  try {
    await db.insert(emails).values(email);

    return {};
  } catch (error) {
    if (error instanceof DatabaseError) {
      const parsedError = parseDatabaseError<InsertEmailProps>({
        fields: email,
        error,
      });
      return { columnErrors: parsedError };
    } else {
      return { errorMessage: "Unknown Error" };
    }
  }
}
