const express = require('express')
const router = express.Router();
const {Genre} = require('../models/genre');
const {Movie, validateMovie} = require('../models/movie');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

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

router.get('/', (req, res) => {
    listMovies()
        .then((result) => {
            console.log(result)
            res.send(result)
        })
})
router.post('/',auth, async (req, res)=>{
    
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
    addMovie(req.body.title, genre, req.body.numberInStock, req.body.dailyRentalRate)
        .then((result) => {
            res.send(result)
        })
})
router.get('/:id', (req, res) => {
    const movieId = req.params.id;
    getMovie(movieId)
        .then((result) => {
            console.log(result)
            res.send(result)
        })
    // let genre = genres.find(g => g.id === parseInt(genreId));
    // if(!genre) return res.status(404).send("genre not found");
});
router.put('/:id',auth, (req, res) => {
    const movieId = req.params.id;
    // const genre = genres.find(g => g.id === parseInt(genreId));
    // if(!genre) return res.status(404).send("genre not found");
    
    const {error} = validateMovie(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    // genre.name = req.body.name;
    
    movieTitle = req.body.title;
    updateMovie(movieId, movieTitle)
        .then((result)=>{
            res.send(result)
        })
    // res.send(genre);
});

router.delete('/:id',auth,admin, (req, res)=>{
    const movieId = req.params.id;
    // const genre = genres.find(g => g.id === parseInt(genreId));
    // if(!genre) return res.status(404).send("genre not found");
    // genres.splice(genres.indexOf(genre), 1);
    deleteGenre(movieId)
        .then((result) => {
            res.send(result);
        })
})
module.exports = router;