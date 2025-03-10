import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import config from "../config";

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.cloud_api_key,
  api_secret: config.cloud_api_secret,
});

export default cloudinary;
