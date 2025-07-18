import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export default {
  port: process.env.PORT,
  client_url:
    process.env.NODE_ENV === "production"
      ? process.env.CLIENT_LIVE_URL
      : process.env.CLIENT_URL,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  // default_pass: process.env.DEFAULT_PASS,
  node_env: process.env.NODE_ENV,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  cloudinary_name: process.env.CLOUDINARY_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  node_mail_email: process.env.NODE_MAIL_EMAIL,
  node_mail_pass: process.env.NODE_MAIL_PASS,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_webhook_key: process.env.STRIPE_WEBHOOK_KEY,
  // super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
};
