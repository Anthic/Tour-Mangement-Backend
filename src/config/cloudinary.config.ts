import { v2 as cloudinary } from "cloudinary";
import { configEnv } from "./env";


cloudinary.config({
  cloud_name: configEnv.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: configEnv.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: configEnv.CLOUDINARY.CLOUDINARY_API_SECRET,
});


export default cloudinary;