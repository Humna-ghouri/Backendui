// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export const sendWelcomeEmail = async (name, email) => {
//   const mailOptions = {
//     from: `"Saylani Qarze Hasana" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: 'Welcome to Qarze Hasana Microfinance Portal',
//     html: `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <style>
//         body { font-family: Arial, sans-serif; line-height: 1.6; }
//         .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//         .header { background-color: #005f87; color: white; padding: 20px; text-align: center; }
//         .content { padding: 20px; }
//         .footer { text-align: center; padding: 10px; font-size: 12px; color: #666; }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h1>Welcome to Qarze Hasana</h1>
//         </div>
//         <div class="content">
//           <p>Hello ${name},</p>
//           <p>Thank you for registering with Qarze Hasana Microfinance Portal.</p>
//           <p>You can now login to your account and apply for interest-free loans.</p>
//           <p>Best regards,</p>
//           <p>Saylani Welfare Team</p>
//         </div>
//         <div class="footer">
//           <p>© ${new Date().getFullYear()} Saylani Welfare International Trust</p>
//         </div>
//       </div>
//     </body>
//     </html>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Welcome email sent to:', email);
//   } catch (error) {
//     console.error('Error sending welcome email:', error);
//     throw error;
//   }
// };


import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async (name, email) => {
  const mailOptions = {
    from: `"Todo App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Your Todo App',
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Todo App</title>
      <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f9; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; text-align: center; font-size: 16px; line-height: 1.5; }
        .footer { text-align: center; font-size: 12px; color: #666; padding: 10px; border-top: 1px solid #f1f1f1; }
        .btn { background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .btn:hover { background-color: #45a049; }
        .footer p { margin: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Todo App!</h1>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>Thank you for signing up with our Todo app! You're all set to start organizing your tasks and staying productive.</p>
          <p><strong>Your journey to better productivity starts now!</strong></p>
          <p>Log in and start adding tasks to your list!</p>
          <a href="#" class="btn">Get Started</a>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Todo App. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};
