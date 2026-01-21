import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function UploadImage(image: File): Promise<UploadApiResponse> {
  const fileImage = image;
  const bytes = await fileImage.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "arahkanan/cardImage",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    stream.end(buffer);
  });
  return result as UploadApiResponse;
}

export async function DeleteImage(
  public_id: string,
): Promise<{ success: boolean }> {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return { success: true };
  } catch {
    return { success: false };
  }
}
