const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const controllers = require('./controllers');
const app = express();
const port = 8888;
app.use(cors());//solving the CORS issue
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
mongoose.connect(
    'mongodb+srv://admin:admin123456@jstraining-2olku.mongodb.net/army?retryWrites=true&w=majority', 
    {useNewUrlParser: true, 
    useUnifiedTopology: true}
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("db connected");
});
app.use('/uploads', express.static('uploads'))
app.use(controllers);
app.listen(port);