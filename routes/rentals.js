const {Rental, validateRental} = require('../models/rental');
const {Movie} = require('../models/movie')
const {Customer} = require('../models/customer')
const mongoose = require('mongoose');
const Fawn = require('fawn') 
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth') //...authorization
const admin = require('../middleware/admin') //...authorization
const asyncMiddleware = require('../middleware/async')
Fawn.init('mongodb://127.0.0.1:27017/vidly')

async function addRental(customerId, movieId){
    const customer = await Customer.findById(customerId)
    if(!customer) return res.status(400).send('Invalid Customer.')
    const movie = await Movie.findById(movieId)
    if(!movie) return res.status(400).send('Invalid Movie.')
    if(movie.numberInStock === 0) return res.status(400).send('Movie not in stock.')
    const asyncMiddleware = require('../middleware/async')
    const rental  = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    //we need to update the DB twice so we need to schedule the operateions in tasks
    try {
        new Fawn.Task()
        .save('rentals', rental) //task one
        .update('movies', {_id: movie._id}, { //task two
            $inc: { numberInStock: -1} //decrement the number in stock
        })
        .run();
        return rental
    }catch(e) {
        res.status(500).send('Something Failed with Fawn')
    }
}

router.get('/', asyncMiddleware(async (req, res) => {
    const rental = await Rental.find().sort('-dateOut');
    res.send(rental);
}));

router.post('/', auth, admin, asyncMiddleware(async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) {
        console.log(error.details[0].message);
        return res.status(400).send(error.details[0].message);
    }
    const result = await addRental(req.body.customerId, req.body.movieId);
    res.send(result);
}));

module.exports = router