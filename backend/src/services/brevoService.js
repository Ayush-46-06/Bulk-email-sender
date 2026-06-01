const brevo = require('sib-api-v3-sdk');
const handlebars = require('handlebars');

const sendDynamicEmail = async (contact, campaign) => {
  try {
    const defaultClient = brevo.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new brevo.TransactionalEmailsApi();
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    // Compile template using Handlebars
    const template = handlebars.compile(campaign.htmlTemplate);
    // Pass the entire contact object to template (which includes all dynamic fields)
    const htmlContent = template(contact);

    sendSmtpEmail.subject = campaign.subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { 
      name: process.env.SENDER_NAME || "Athenura", 
      email: process.env.EMAIL_FROM || "no-reply@yourdomain.com" 
    };
    sendSmtpEmail.to = [{ email: contact.email, name: contact.name || '' }];

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return result;
  } catch (error) {
    console.error('Error sending email via Brevo:', error);
    throw error;
  }
};

module.exports = {
  sendDynamicEmail
};
