const dotenv = require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');

var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// no idea why I need these
const bodyParser = require('body-parser');
const methodOverride = require('method-override')

const posts = require("./controllers/posts");
const comments = require("./controllers/comments");
const auth = require("./controllers/auth");

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser()); // Add this after you initialize express.


// MONGOOSE STUFF
const mongoose = require('mongoose');

// Connect to the database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/reddit-clone', {useNewUrlParser: true})
.then(() => {
    console.log("Connected to DB");
})
.catch( err => {
    throw err;
})

auth(app)
posts(app);
comments(app);

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))