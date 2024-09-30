// "use strict";
// const cloudinary = require("cloudinary").v2;
// require("dotenv").config();

// cloudinary.config({
//   secure: true,
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET,
// });

// /**
//  * Uploads an image base64 to Cloudinary.
//  * @param {String} image - The image base64 to upload.
//  * @param {String} public_id - The identifier that's used for accessing and delivering the uploaded asset.
//  * @returns {Promise<string>} A promise that resolves to the secure URL of the uploaded image on Cloudinary.
//  * @throws {Error} If there's an error during the upload process.
//  */
// const uploadToCloudinary = async (image, public_id) => {
//   try {
//     const response = await cloudinary.uploader.upload(image, {
//       resource_type: "auto",
//       public_id,
//     });

//     return response.secure_url;
//   } catch (error) {
//     console.log("Error uploading image to Cloudinary: ", error.message);
//     throw new Error("Error uploading image to Cloudinary");
//   }
// };

// module.exports = uploadToCloudinary;

"use strict";
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

/**
 * Uploads an image base64 to Cloudinary with resizing to 1024x1024 pixels.
 * @param {String} image - The image base64 to upload.
 * @param {String} public_id - The identifier that's used for accessing and delivering the uploaded asset.
 * @returns {Promise<string>} A promise that resolves to the secure URL of the uploaded image on Cloudinary.
 * @throws {Error} If there's an error during the upload process.
 */
const uploadToCloudinary = async (image, public_id) => {
  try {
    const response = await cloudinary.uploader.upload(image, {
      resource_type: "auto",
      public_id,
      transformation: [
        {
          width: 1024,
          height: 1024,
          crop: "fit",
        },
      ],
    });
    return response.secure_url;
  } catch (error) {
    console.log("Error uploading image to Cloudinary: ", error.message);
    throw new Error("Error uploading image to Cloudinary");
  }
};

module.exports = uploadToCloudinary;
