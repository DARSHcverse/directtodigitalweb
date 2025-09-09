const sgMail = require('@sendgrid/mail');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const {
      fullName,
      email,
      phoneNumber,
      service,
      message,
      price,
      invoiceNumber,
    } = data;

    // ✅ Validation (price/invoiceNumber optional)
    if (
      !fullName ||
      !email ||
      !phoneNumber ||
      !service
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Required fields are missing for booking.' }),
      };
    }

    // ----------------------
    // Stripe: Create Customer
    // ----------------------
    const customer = await stripe.customers.create({
      name: fullName,
      email,
      phone: phoneNumber,
    });

    console.log('Stripe customer created:', customer.id);

    // Optionally create invoice
    let invoice = null;
    if (process.env.STRIPE_SECRET_KEY && price && invoiceNumber) {
      // ----------------------
      // Stripe: Add Invoice Item
      // ----------------------
      await stripe.invoiceItems.create({
        customer: customer.id,
        amount: Math.round(price * 100), // cents
        currency: 'aud',
        description: `${service} (Invoice: ${invoiceNumber})`,
      });

      // ----------------------
      // Stripe: Create Invoice (do not finalize)
      // ----------------------
      let dueDate = Math.floor(new Date().getTime() / 1000) + (7 * 24 * 60 * 60); // 7 days from now

      invoice = await stripe.invoices.create({
        customer: customer.id,
        auto_advance: false, // leave draft
        collection_method: 'send_invoice',
        description: `Booking Invoice #${invoiceNumber}`,
        metadata: { invoice_number: invoiceNumber },
        due_date: dueDate,
      });

      console.log('Invoice created:', invoice.id);
    }

    // ----------------------
    // Send Email to Customer
    // ----------------------
    try {
      await sgMail.send({
        to: email,
        from: {
          email: 'dharshansubramaniyam2@gmail.com',
          name: 'D2D Web',
        },
        subject: `Your Booking Request${invoiceNumber ? ` - ${invoiceNumber}` : ''}`,
        html: `
          <h3>Hi ${fullName},</h3>
          <p>Thank you for booking <strong>D2D Web</strong>! 🎉</p>
          <p>Your booking request has been received.</p>
          ${invoiceNumber ? `<p><strong>Invoice Number:</strong> ${invoiceNumber}</p>` : ''}
          <p><strong>Service:</strong> ${service}</p>
          ${price ? `<p><strong>Total Price:</strong> AUD ${price}</p>` : ''}
          ${
            invoice && invoice.hosted_invoice_url
              ? `<p>You can securely pay your invoice using the button below:</p>
                 <p>
                   <a href="${invoice.hosted_invoice_url}" 
                      style="background:#f5a623;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">
                      View Invoice
                   </a>
                 </p>`
              : ''
          }
          <p>We look forward to working together!</p>
          <p>– D2D Web</p>
        `,
      });
      console.log('Customer email sent');
    } catch (emailErr) {
      console.error('Customer email failed:', emailErr);
    }

    // ----------------------
    // Send Admin Notification
    // ----------------------
    try {
      await sgMail.send({
        to: 'theshanbooth@gmail.com',
        from: {
          email: 'dharshansubramaniyam2@gmail.com',
          name: 'D2D Web',
        },
        replyTo: email, // 📌 reply goes to the customer
        subject: `New D2D Web Booking from ${fullName}`,
        html: `
          <h3>New Booking Details:</h3>
          ${invoiceNumber ? `<p><strong>Invoice Number:</strong> ${invoiceNumber}</p>` : ''}
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone Number:</strong> ${phoneNumber}</p>
          <p><strong>Service Type:</strong> ${service}</p>
          ${price ? `<p><strong>Price:</strong> AUD ${price}</p>` : ''}
          <p><strong>Message:</strong><br>${message ? message.replace(/\n/g, '<br>') : 'N/A'}</p>
        `,
      });
      console.log('Admin email sent');
    } catch (adminErr) {
      console.error('Admin email failed:', adminErr);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: invoice ? 'Booking created & draft invoice sent!' : 'Booking received!' }),
    };
  } catch (err) {
    console.error('Error in booking:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Failed to process booking.' }),
    };
  }
};
