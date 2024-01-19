const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const upload = multer({ /* multer config */ });


cloudinary.config({ 
  cloud_name: 'dwpwn8tvn', 
  api_key: '431399934213653', 
  api_secret: 'vehbaIbfUDUOd7PDifVuqmeBuG0' 
});

exports.uploadImage = upload.single('image'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload_stream({
            resource_type: 'raw'
        }, (error, result) => {
            if (error) throw error;
            return result;
        }).end(req.file.buffer);
        console.log(result, "image hit");
        res.json({ message: 'Image uploaded successfully', url: result.secure_url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
