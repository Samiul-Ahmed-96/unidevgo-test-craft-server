import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const databaseUrl = process.env.DATABASE_URL as string;
const port = process.env.PORT || "3000";

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be defined in the environment variables");
}

export default {
  port,
  database_url: databaseUrl,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUND,
  sender_email: process.env.SENDER_EMAIL,
  sender_password: process.env.SENDER_PASSWORD,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloud_api_key: process.env.CLOUDINARY_API_KEY,
  cloud_api_secret: process.env.CLOUDINARY_API_SECRET,
};
