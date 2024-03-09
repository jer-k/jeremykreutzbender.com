import { processContactForm } from "@/app/actions/contact";

jest.mock("@/app/actions/emails/send");

describe("processContactForm", () => {
  describe("when the schema is invalid", () => {
    it("returns a object with an error", async () => {
      const response = await processContactForm({
        fullName: "Test Name",
        emailAddress: "not-an-email.com",
        message: "Test Message",
      });

      expect(response).toMatchObject({
        formErrors: {
          email: "",
        },
      });
    });
  });

  describe("when the email fails to send", () => {
    it("returns a object with an error", async () => {});
  });

  describe("when the email sends", () => {});
});
