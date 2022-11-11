const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/quick-auth');
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/quick-auth', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

db.once('open', () => {
    console.log('Connected to Database :: MongoDB');
});

module.exports = db;