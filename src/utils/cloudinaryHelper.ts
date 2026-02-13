import cloudinary from "../config/cloudinary.config";


/**
 * Delete a single image from Cloudinary
 * @param publicId - The public ID of the image (extract from URL)
 */
export const deleteImageFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param publicIds - Array of public IDs
 */
export const deleteMultipleImages = async (publicIds: string[]) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error("Error deleting multiple images:", error);
    throw error;
  }
};

/**
 * Extract public ID from Cloudinary URL
 * Example: https://res.cloudinary.com/demo/image/upload/v1234567890/tour-management/tours/tour-123.jpg
 * Returns: tour-management/tours/tour-123
 */
export const extractPublicId = (url: string): string => {
  const parts = url.split("/");
  const uploadIndex = parts.indexOf("upload");
  
  if (uploadIndex !== -1 && uploadIndex + 2 < parts.length) {
    // Get everything after version number, remove extension
    const pathWithExtension = parts.slice(uploadIndex + 2).join("/");
    return pathWithExtension.replace(/\.[^/.]+$/, ""); // Remove file extension
  }
  
  return "";
};