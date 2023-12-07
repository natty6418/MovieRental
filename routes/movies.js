const express = require('express')
const router = express.Router();
const {Genre} = require('../models/genre');
const {Movie, validateMovie} = require('../models/movie');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');

async function addMovie(title, genre, numberInStock, dailyRentalRate){
    const movie = new Movie({
        title: title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: numberInStock,
        dailyRentalRate: dailyRentalRate
    });
    try {
        const result = await movie.save()
        return result;
    } catch(e) {
        for (e in e.errors)
            console.log(e.errors[e].message)
    }
}
async function deleteMovie(id){
    const movie = await Movie.findById(id)
    movie.remove();
    movie.save();
    return movie
}

async function getMovie(id) {
    const movie = await Movie.findById(id)
    return movie
}
async function listMovies(){
    const movies = await Movie.find()
    return movies
}
async function updateMovie(movieId, title) {
    const movie = Movie.findById(movieId)
    movie.title = title
    movie.save()
    return movie
}

router.get('/', asyncMiddleware(async (req, res) => {
    const movies = await listMovies()
    res.send(movies)
}));
router.post('/',auth, asyncMiddleware(async (req, res)=>{
    
    const {error} = validateMovie(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    const genre = await Genre.findById(req.body.genreId)
    if (!genre) return res.status(400).send('Invalid Genre.')
    // const genre = {
    //     id: genres.length +1,
    //     name: req.body.name
    // }
    // genres.push(genre);
    const movie = await addMovie(req.body.title, genre, req.body.numberInStock, req.body.dailyRentalRate)
    res.send(movie)
}));
router.get('/:id', asyncMiddleware(async (req, res) => {

        const movieId = req.params.id;
        const result = await getMovie(movieId);
        console.log(result);
        res.send(result);
}));

router.put('/:id', auth, asyncMiddleware(async (req, res) => {
        const movieId = req.params.id;
        const { error } = validateMovie(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const movieTitle = req.body.title;
        const result = await updateMovie(movieId, movieTitle);
        res.send(result);
}));

router.delete('/:id', auth, admin, asyncMiddleware(async (req, res) => {
        const movieId = req.params.id;
        const result = await deleteMovie(movieId);
        res.send(result);
}));
module.exports = router;