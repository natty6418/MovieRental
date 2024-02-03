require('express-async-errors')
const winston = require('winston');
require('winston-mongodb');
const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
require('express-async-errors')
const config = require('config')
const app = express();
const genres = require('./routes/genres');
const movies = require('./routes/movies')
const rental = require('./routes/rentals')
const home = require('./routes/home');
const users = require('./routes/users')
const customers = require('./routes/customers');
const auth = require('./routes/auth');
const error = require('./middleware/error'); 

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.MongoDB({ 
    db: 'mongodb://localhost/vidly',
    level: 'info'
}));

if (!config.get('jwtPrivateKey')) { // check if jwtPrivateKey is defined
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

mongoose.connect('mongodb://127.0.0.1:27017/vidly')
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.log("error", err));


app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rental);
app.use('/api/users', users);
app.use('/', home);
app.use('/api/auth', auth);
app.use(error)

const port = process.env.port || 3000;
app.listen(port, ()=> console.log(`Listening on port ${port}....`));