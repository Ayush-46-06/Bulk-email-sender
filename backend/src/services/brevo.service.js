import SibApiV3Sdk
from "@getbrevo/brevo";

const apiInstance =
new SibApiV3Sdk.TransactionalEmailsApi();

apiInstance.setApiKey(
  SibApiV3Sdk
    .TransactionalEmailsApiApiKeys
    .apiKey,
  process.env.BREVO_API_KEY
);

export const sendEmail =
async (
  to,
  name,
  subject,
  html
) => {

  return apiInstance.sendTransacEmail({
    sender: {
      email:
      process.env.SENDER_EMAIL,
      name:
      process.env.SENDER_NAME
    },

    to: [
      {
        email: to,
        name
      }
    ],

    subject,
    htmlContent: html
  });
};