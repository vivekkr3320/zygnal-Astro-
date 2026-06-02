import * as React from "react";
import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
  Link,
  Img
} from "@react-email/components";

interface ReportEmailTemplateProps {
  explorerName: string;
  reportUrl: string;
}

export const ReportEmailTemplate = ({
  explorerName = "Cosmic Soul",
  reportUrl,
}: ReportEmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>Your Zygnal Astro Celestial Blueprint is ready to view.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={brand}>ZYGNAL ASTRO</Text>
        </Section>
        <Section style={content}>
          <Heading style={heading}>The Stars Align.</Heading>
          <Text style={paragraph}>
            Greetings {explorerName},
          </Text>
          <Text style={paragraph}>
            Your premium celestial blueprint has been successfully synthesized. 
            Inside, you will discover deep insights into your core identity, personality dynamics, career trajectory, and relationship patterns.
          </Text>
          <Section style={btnContainer}>
            <Link href={reportUrl} style={button}>
              Unlock Your Chart
            </Link>
          </Section>
          <Text style={paragraph}>
            Keep this link safe. Your report is permanently available at this secure URL.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            Cosmic regards, <br />
            The Zygnal Astro Team
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#030114",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
};

const header = {
  padding: "20px 0",
  textAlign: "center" as const,
};

const brand = {
  color: "#d4af37",
  fontSize: "24px",
  fontWeight: "bold",
  letterSpacing: "4px",
  textAlign: "center" as const,
};

const content = {
  backgroundColor: "#110f1c",
  padding: "40px",
  borderRadius: "8px",
  border: "1px solid rgba(212,175,55,0.2)",
};

const heading = {
  color: "#f8f4ff",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  marginBottom: "30px",
};

const paragraph = {
  color: "#c8c4d4",
  fontSize: "16px",
  lineHeight: "26px",
  marginBottom: "20px",
};

const btnContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "rgba(212,175,55,0.1)",
  border: "1px solid #d4af37",
  borderRadius: "4px",
  color: "#d4af37",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "16px",
};

const hr = {
  borderColor: "rgba(212,175,55,0.15)",
  margin: "30px 0",
};

const footer = {
  color: "#888",
  fontSize: "14px",
  lineHeight: "24px",
};
