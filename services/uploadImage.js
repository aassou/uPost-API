const multer = require( 'multer');
const { GridFsStorage } = require( 'multer-gridfs-storage');
const path = require( 'path');
const dotenv = require('dotenv');

dotenv.config();

const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = `image-${Date.now()}${path.extname(file.originalname)}`;

            const fileInfo = {
                filename: filename,
                bucketName: 'images'
            };

            resolve(fileInfo);
        })
    }
});

const upload = multer({ storage });

module.exports = {upload};