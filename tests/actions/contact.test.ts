import { sendEmail } from "@/app/actions/contact";
import * as ContactEmailTemplates from "@/components/email_templates/contact-email";
import { resend } from "@/lib/resend";

jest.mock("@/lib/resend", () => ({
  resend: {
    emails: {
      send: jest.fn()
    }
  }
}));

jest.mock("@/components/email_templates/contact-email");

describe('sendEmail', () => {
  describe("when the schema is invalid", () => {
    it("returns a object with an error", async () => {
      const response = await sendEmail({
        name: "Test Name",
        emailAddress: "not-an-email.com",
        message: "Test Message"
      });

      expect(response).toMatchObject({
        error: {
          "_errors": [],
          emailAddress: {
            "_errors": [
              "Invalid email",
            ],
          },
        }
      })
    })
  })

  describe("when the email fails to send", () => {
    it("returns a object with an error", async () => {
      (resend.emails.send as jest.Mock).mockReturnValueOnce({
        data: null,
        error: {
          message: "Test email failed to send",
          name: "not_found"
        }
      });

      const response = await sendEmail({
        name: "Test Name",
        emailAddress: "test-email@gmail.com",
        message: "Test Message"
      });

      expect(response).toMatchObject({error: {
          message: "Test email failed to send",
          name: "not_found"
      }})
    })
  })

  describe("when the email sends", () => {
    it("returns an empty object", async () => {
      const { ContactEmail } = ContactEmailTemplates as jest.Mocked<typeof ContactEmailTemplates>;
      // Ignore Typescript on this for now. I tried to use
      // ContactEmail.mockImplementation(() => <div>MockedReturnValue</div>) but it got even more
      // angry. The test passes with this so I'm content for now
      // @ts-ignore
      ContactEmail.mockReturnValue("MockedReturnValue");

      (resend.emails.send as jest.Mock).mockReturnValueOnce({
        data: {
          id: "testemailsuccess"
        },
        error: null
      });

      const response = await sendEmail({
        name: "Test Name",
        emailAddress: "test-email@gmail.com",
        message: "Test Message"
      })

      expect(response).toMatchObject({})

      expect(ContactEmail).toHaveBeenCalledWith({
        name: "Test Name",
        emailAddress: "test-email@gmail.com",
        message: "Test Message"
      })

      expect(resend.emails.send).toHaveBeenCalledWith({
        from: "test-address@jeremykreutzbender.com",
        to: ["my-test-address@gmail.com"],
        subject: "Test Name Contacted You",
        react: expect.anything(),
      })
    })
  })
});
