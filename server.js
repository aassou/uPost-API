const express = require('express');
const cors = require( 'cors');
const mongoose = require('mongoose');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
const Pusher = require("pusher");
// const { initialize } = require('express-openapi');

const pusher = new Pusher({
  appId: "1294887",
  key: "ffca908f44668a3102f5",
  secret: "3df6c3bd061a9175fd40",
  cluster: "us3",
  useTLS: true
});

const watchCollection = mongoose.connection.once('open', () => {
    console.log('Watching DB...');

    const changeStream = mongoose.connection.collection('posts').watch();

    changeStream.on('change', change => {
        console.log(change);

        if (change.operationType === 'insert') {
            console.log('Triggering Pusher...');

            pusher.trigger('posts', 'inserted', {
                change: change
            });
        } else {
            console.log('Error Triggering Pusher!');
        }
    });
});

process.env.TZ = 'Europe/Berlin';

// app config
const app = express();

// middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging
let logginStreamName = 'logs/access.log';

app.use(logginSplit);
app.use(morgan('common', {
    stream: fs.createWriteStream(path.join(__dirname, logginStreamName),{ flags: 'a' })
}));

app.get('/api', (req, res) => res.status(200).send('Welcome to uPost API!'));

require('./routes/postRoutes')(app);
require('./routes/imageRoutes')(app);

// listen port
app.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT} ...`));

function logginSplit(req, res, next) {
    if (res.statusCode >= 400 && res.statusCode <=599) {
        logginStreamName = 'logs/errors.log';
    }

    next();
} 