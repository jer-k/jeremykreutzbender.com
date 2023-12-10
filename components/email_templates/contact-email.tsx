import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

type ContactEmailProps = {
  fullName: string;
  emailAddress: string;
  message: string;
};

export function ContactEmail({
  fullName,
  emailAddress,
  message,
}: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{fullName} contacted you</Preview>
      <Body>
        <Container>
          <Heading>
            {fullName} contacted you from {emailAddress}
          </Heading>
          <Text>{message}</Text>
        </Container>
      </Body>
    </Html>
  );
}
