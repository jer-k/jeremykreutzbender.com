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
  name: string;
  emailAddress: string;
  message: string;
}

export function ContactEmail({name, emailAddress, message}: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{name} contacted you</Preview>
      <Body>
        <Container>
          <Heading>{name} contacted you from {emailAddress}</Heading>
          <Text>
            {message}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
