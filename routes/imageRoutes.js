const mongoose = require('mongoose');
const Grid = require( 'gridfs-stream');
const uploadImage = require('../services/uploadImage');
const { createConnection, connect } = require('../services/mongoConnection');

module.exports = (app) => {
    Grid.mongo = mongoose.mongo;

    let gfs;
    let gridFSBucket;

    createConnection.once('open', () => {
        gfs = Grid(createConnection.db, mongoose.mongo);
        gridFSBucket = new mongoose.mongo.GridFSBucket(createConnection.db, {
            bucketName: 'images'
        });
        gfs.collection('images');
    });

    connect;

    app.post('/api/images', uploadImage.upload.single('file'), (req, res) => {
        try {
            res.status(201).send(req.file);   
        } catch (error) {
            console.log(error);
        }
    });

    app.get('/api/images/:imagename', (req, res) => {
        gfs.files.findOne({filename: req.params.imagename}, (err, file) => {
            if (err) {
                res.status(500).send(err);
            } else {
                if (!file || file.length === 0) {
                    res.status(404).json({err: 'File not found!'});
                } else {
                    const readstream = gridFSBucket.openDownloadStream(file._id);
                    readstream.pipe(res);
                    console.log('File retirieved!');
                }
            }
        });
    });
}