import { DatabaseError } from "@planetscale/database";

import { parseDatabaseError } from "@/lib/db/parse-error";

type GoodSchema = {
  fullName: string;
};

type BadSchema = {
  badName: string;
};

const errorMessage = `target: jeremykreutzbender-com.-.primary: vttablet: rpc error: code = Unknown desc = Field 'full_name' doesn't have a default value (errno 1364) (sqlstate HY000) (CallerID: n2977obvzzdyw91ct6q1): Sql: "insert into emails(id, full_name, email_address, message) values (default, default, default, default)", BindVars: {REDACTED}`;

const error: DatabaseError = {
  status: 400,
  message: errorMessage,
  name: "DatabaseError",
  body: {
    message: errorMessage,
    code: "UNKNOWN",
  },
};
describe("parseDatabaseError", () => {
  describe("when the error matches the schema passed in", () => {
    it("returns a adds the error message to the formFields", () => {
      const fields: GoodSchema = {
        fullName: "",
      };
      expect(
        parseDatabaseError<GoodSchema>({
          fields,
          error,
        }),
      ).toMatchObject({
        formFields: { fullName: "'full_name' doesn't have a default value" },
      });
    });
  });

  describe("when the error does not match the schema passed in", () => {
    it("returns a generic error message", () => {
      const fields: BadSchema = {
        badName: "tester",
      };
      expect(
        parseDatabaseError<BadSchema>({
          fields,
          error,
        }),
      ).toMatchObject({ base: ["'full_name' doesn't have a default value"] });
    });
  });
});
