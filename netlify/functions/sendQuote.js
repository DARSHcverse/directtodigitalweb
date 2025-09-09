// netlify/functions/sendQuote.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { fullName, name, email, phoneNumber, message } = data;

    let subject, html;

    // ----------------------
    // Quick Quote
    // ----------------------
    if (fullName && phoneNumber) {
      subject = `New Quick Quote Request from ${fullName}`;
      html = `
        <h3>New Quick Quote Request Details:</h3>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${phoneNumber}</p>
        <p><strong>Message:</strong><br>${message ? message.replace(/\n/g, '<br>') : 'N/A'}</p>
      `;
    }

    // ----------------------
    // Contact Form
    // ----------------------
    else if (name && email && message) {
      subject = `New Contact Form Message from ${name}`;
      html = `
        <h3>New Contact Form Submission:</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
      `;
    }

    // Validation check
    else {
      return { statusCode: 400, body: JSON.stringify({ error: 'Required fields are missing.' }) };
    }

    // ----------------------
    // Send email
    // ----------------------
    const msg = {
      to: 'theshanbooth@gmail.com',
      from: 'dharshansubramaniyam2@gmail.com',
      replyTo: email,
      subject,
      html,
    };

    await sgMail.send(msg);

    return { statusCode: 200, body: JSON.stringify({ message: 'Email sent successfully!' }) };
  } catch (err) {
    console.error('Error in sendQuote:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to process request.' }) };
  }
};
