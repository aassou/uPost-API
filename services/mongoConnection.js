const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const createConnection = mongoose.createConnection(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connect = mongoose.connect(process.env.MONGO_URI , {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// const watchCollection = mongoose.connection.once('open', () => {
//     console.log('Watching DB...');

//     const changeStream = mongoose.connection.collection('posts').watch();

//     changeStream.on('change', change => {
//         console.log(change);

//         if (change.operationType === 'insert') {
//             console.log('Triggering Pusher...');

//             push
//         }
//     });
// });

module.exports = {createConnection, connect};