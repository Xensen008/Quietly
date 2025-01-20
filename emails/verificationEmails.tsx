import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
  Container,
  Body,
  Tailwind,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
      <Html>
          <Head>
              <Font
                  fontFamily="Roboto"
                  fallbackFontFamily="Verdana"
                  webFont={{
                      url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
                      format: 'woff2',
                  }}
                  fontWeight={400}
                  fontStyle="normal"
              />
          </Head>
          <Preview>Welcome to Quietly - Your Verification Code: {otp}</Preview>
          <Tailwind>
              <Body className="bg-white my-auto mx-auto font-sans">
                  <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                      <Section className="mt-[32px]">
                          <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                              <strong>Welcome to Quietly</strong>
                          </Heading>
                      </Section>
                      <Text className="text-black text-[14px] leading-[24px]">
                          Hello <strong>{username}</strong>,
                      </Text>
                      <Text className="text-black text-[14px] leading-[24px]">
                          Thank you for choosing Quietly. To complete your registration, please use the verification code below:
                      </Text>
                      <Section className="text-center my-[32px] mx-0">
                          <Text className="text-[32px] font-bold tracking-[6px] p-[20px] bg-[#f4f4f4] rounded-lg inline-block">
                              {otp}
                          </Text>
                      </Section>
                      <Text className="text-black text-[14px] leading-[24px]">
                          This code will expire in 10 minutes. If you didn't request this verification code, please ignore this email.
                      </Text>
                      <Text className="text-black text-[14px] leading-[24px]">
                          Best regards,<br />
                          The Quietly Team
                      </Text>
                      <Section className="text-center mt-[32px] mb-[32px]">
                          <Text className="text-[12px] text-gray-500">
                              © 2024 Quietly. All rights reserved.
                          </Text>
                      </Section>
                  </Container>
              </Body>
          </Tailwind>
      </Html>
  );
}