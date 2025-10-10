const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({ region: "us-east-1" }); // Set your SES region here

const sendVerificationEmail = async (email, token) => {
  const verificationLink = `https://yourdomain.com/verify-email?token=${token}`;

  const params = {
    Destination: { ToAddresses: [email] },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <h1>Verify your email</h1>
            <p>Click the link below to verify your email:</p>
            <a href="${verificationLink}">${verificationLink}</a>
          `,
        },
      },
      Subject: { Charset: "UTF-8", Data: "Email Verification" },
    },
    Source: "no-reply@yourdomain.com", // This must be a verified sender in SES
  };

  const command = new SendEmailCommand(params);
  return sesClient.send(command);
};

module.exports = { sendVerificationEmail };
