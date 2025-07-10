import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export const emailTemplates = {
  contactForm: (data: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }) => `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message}</p>
  `,

  newMessage: (data: {
    from: string;
    subject: string;
    message: string;
  }) => `
    <h2>New Message Received</h2>
    <p><strong>From:</strong> ${data.from}</p>
    <p><strong>Subject:</strong> ${data.subject}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message}</p>
  `,

  newSubscriber: (data: { email: string }) => `
    <h2>New Newsletter Subscription</h2>
    <p>A new user has subscribed to the newsletter.</p>
    <p><strong>Email:</strong> ${data.email}</p>
  `,
}; 