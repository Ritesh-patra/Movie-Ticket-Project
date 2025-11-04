import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


const sendEmail = async ({ to, subject, body }) => {
  try {
    const response = await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to,
      subject,
      html: body,
    });

    console.log(`Email sent to ${to}: messageId=${response.messageId}`);
    return response;
  } catch (error) {
    console.error("Error sending email to", to, error);
    throw error;
  }
};

export default sendEmail;