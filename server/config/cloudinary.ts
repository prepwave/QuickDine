import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
export async function uploadTest() {
  try {
    const result = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/sample.jpg"
    );

    console.log("TEST UPLOAD SUCCESS");
    console.log(result.secure_url);
  } catch (err) {
    console.error("TEST UPLOAD FAILED");
    console.error(err);
  }
}