import path from "path";

import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../../config/cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "tour-management/general";
    if (file.fieldname === "thumbnail") {
      folder = "tour-management/divisions";
    } else if (file.fieldname === "images") {
      folder = "tour-management/tours";
    } else if (file.fieldname === "image") {
      folder = "tour-management/single-images";
    }
    return {
      folder: folder,
      formate: path.extname(file.originalname).slice(1),
      public_id: `${file.fieldname}-${Date.now()}`,
      transformation: [
        { width: 1200, height: 800, crop: "limit" },
        { quality: "auto" },
      ],
    };
  },
});
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
  }
};
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const uploadTourImages = upload.array("images",10)
export const uploadSingleImage =upload.single("image")
export const uploadThumbnail = upload.single("thumbnail")
