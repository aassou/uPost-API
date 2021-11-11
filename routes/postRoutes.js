const Post = require('../models/Post');

module.exports = (app) => {
    app.post('/api/posts', (req, res) => {
        const dbPost = req.body;
    
        Post.create(dbPost, (err, data) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(201).send(data);
            }
        });
    });
    
    app.get('/api/posts', (req, res) => {
        Post.find((err, data) => {
            if (err) {
                res.status(500).send(err);
            } else {
                data.sort((b, a) => {
                    return a.timestamp - b.timestamp;
                });
                
                res.status(201).send(data);
            }
        });
    });
} 