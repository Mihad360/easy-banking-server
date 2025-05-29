import nodemailer from "nodemailer";
import config from "../config";
// import nodemailer from "nodemailer";
// import config from "../config";

// export const sendEmail = async (to: string, html: string) => {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: config.node_env === "production", // true for port 465, false for other ports
//     auth: {
//       user: "ahmedmihad962@gmail.com",
//       pass: "vaiv feox czui rakq",
//     },
//   });
//   await transporter.sendMail({
//     from: "ahmedmihad962@gmail.com", // sender address
//     to, // list of receivers
//     subject: "Reset your password within 10 mins !", // Subject line
//     text: "", // plain text body
//     html, // html body
//   });
// };

// Create a test account or replace with real credentials.
export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: config.node_mail_email,
      pass: config.node_mail_pass,
    },
  });
  const info = await transporter.sendMail({
    from: '"Easy Bank" <' + config.node_mail_email + ">",
    to: to,
    subject: subject,
    text: "", // plain‑text body
    html: html, // HTML body
  });

  console.log("Message sent:", info.messageId);
};
