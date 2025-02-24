import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinaryV2 from "../../utils/cloudinaryConfig";

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryV2,
  params: async (req, file) => {
    let folder = "uploads"; // Default folder
    let resource_type = "auto"; // Automatically determine file type

    return {
      folder: folder,
      format: file.originalname.split(".").pop(), // Keep original file format
      resource_type: resource_type,
    };
  },
});

// Initialize Multer with Cloudinary Storage
const upload = multer({ storage });

export { upload };
