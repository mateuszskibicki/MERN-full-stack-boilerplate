const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const path = require('path');

// const users = require('./routes/api/users');
// const profile = require('./routes/api/profile');
// // const posts = require('./routes/api/posts');
// const diets = require('./routes/api/diets');
// const recipes = require('./routes/api/recipes');
// const maps = require('./routes/api/maps');
// const contact = require('./routes/api/contact');


const app = express();

// Body parser middleware, req.body available with post requests
app.use(
	bodyParser.urlencoded({
		extended: false,
		limit: '50mb'
	})
);
app.use(bodyParser.json());

// DB Config -> key to connect to MLAB
const db = require('./config/keys').mongoURI;

// Connect to MongoDB MLAB via Mongoose
mongoose
	.connect(db)
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log(err));

// Passport middleware -> auth user -> JWT Strategy
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
// app.use('/api/users', users);
// app.use('/api/profile', profile);
// // app.use('/api/posts', posts);
// app.use('/api/diets', diets);
// app.use('/api/recipes', recipes);
// app.use('/api/maps', maps);
// app.use('/api/contact', contact);

// server static assets if in production
if (process.env.NODE_ENV === 'production') {
// set static folder
	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

// process.env.PORT on heroku
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
