const {v2:cloudinary} = require('cloudinary');
const fs = require('fs');

console.log("Cloudinary ENV Check:", {
    name: process.env.CLOUDINARY_CLOUD_NAME,
    key: process.env.CLOUDINARY_API_KEY,
    secret: process.env.CLOUDINARY_API_SECRET,
});
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (fileToUploadPath) => {
    try {
        if (!fileToUploadPath) return null;
        console.log("Hello->",fileToUploadPath)
        const response = await cloudinary.uploader.upload(fileToUploadPath,{resource_type: 'auto'});
        console.log("cloudinary response",response)
        fs.unlinkSync(fileToUploadPath);
        return response;
    } catch (error) {
        fs.unlinkSync(fileToUploadPath);
        console.log(error)
        return null;
    }
}

module.exports = {uploadToCloudinary};