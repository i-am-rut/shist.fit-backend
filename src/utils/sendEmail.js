const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require('../utils/sesClient')

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [
      ],
      ToAddresses: [
        toAddress,
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <h1>Welcome to Shist</h1>
            <p>Click the link below to verify your email:</p>
          `,
        },
        Text: {
          Charset: "UTF-8",
          Data: "TEXT_FORMAT_BODY",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Welcome",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
    ],
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "amrut@shist.fit",
    "no-reply@shist.fit",
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };
// const sendVerificationEmail = async (email, token) => {
//   const verificationLink = `https://yourdomain.com/verify-email?token=${token}`;

//   const params = {
//     Destination: { ToAddresses: [email] },
//     Message: {
//       Body: {
//         Html: {
//           Charset: "UTF-8",
//           Data: `
//             <h1>Verify your email</h1>
//             <p>Click the link below to verify your email:</p>
//             <a href="${verificationLink}">${verificationLink}</a>
//           `,
//         },
//       },
//       Subject: { Charset: "UTF-8", Data: "Email Verification" },
//     },
//     Source: "no-reply@yourdomain.com", // This must be a verified sender in SES
//   };

//   const command = new SendEmailCommand(params);
//   return sesClient.send(command);
// };

// module.exports = { sendVerificationEmail };
