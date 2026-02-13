

declare global {
  namespace Express {
    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination?: string;
        filename?: string;
        path: string;
        buffer?: Buffer;
        // Cloudinary specific properties
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stream?: any;
      }
    }
  }
}

// Cloudinary file type
export interface CloudinaryFile extends Express.Multer.File {
  path: string; // Cloudinary URL
}