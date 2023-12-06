const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Genre, validate} = require('../models/genre');
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const asyncMiddleware = require('../middleware/async')
async function addGenre(name) {
    const genre = new Genre({
        name: name
    });
    
    try {
        const result = await genre.save()
        return result;
    }
    catch (ex) {
        for (err in ex.errors)
            console.log(ex.errors[err].message)
    }
}

async function getGenre() {
    try{
        const result = await Genre
        .find()
        .limit(10)
        // console.log(result)
        return result
    }
    catch (ex) {
        for (err in ex.errors)
            console.log(ex.errors[err].message)
    }
}
async function getGenreById(id){
    try{
        const result = await Genre
        .find({_id: id})
        return result
    }
    catch (ex) {
        for (err in ex.errors)
            console.log(ex.errors[err].message)
    }
}
async function updateGenre(id, name){
    try {
        const result = await Genre.updateOne({_id: id}, {
        $set: {
            name: name
        }
    })
    return result
    }
    catch (ex) {
        for (err in ex.errors)
            console.log(ex.errors[err].message)
    }
}
async function deleteGenre(id){
    try{
    return await Genre.deleteOne({_id: id});
    }
    catch (ex) {
        for (err in ex.errors)
            console.log(ex.errors[err].message)
    }
}
// const genres = [
//     {id:1, name:"Action"},
//     {id:2, name:"Comedy"},
//     {id:3, name:"Drama"},
//     {id:4, name:"Horror"}
// ]

router.get('/', asyncMiddleware((req, res) => {
    getGenre()
        .then((result) => {
            console.log(result)
            res.send(result)
        })
}))
router.post('/', auth, (req, res)=>{
    
    const {error} = validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    // const genre = {
    //     id: genres.length +1,
    //     name: req.body.name
    // }
    // genres.push(genre);
    addGenre(req.body.name)
        .then((result) => {
            res.send(result)
        })
})
router.get('/:id', (req, res) => {
    const genreId = req.params.id;
    getGenreById(genreId)
        .then((result) => {
            console.log(result)
            res.send(result)
        })
    // let genre = genres.find(g => g.id === parseInt(genreId));
    // if(!genre) return res.status(404).send("genre not found");
});
router.put('/:id',auth, (req, res) => {
    const genreId = req.params.id;
    // const genre = genres.find(g => g.id === parseInt(genreId));
    // if(!genre) return res.status(404).send("genre not found");
    
    const {error} = validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    // genre.name = req.body.name;
    
    genreName = req.body.name;
    updateGenre(genreId, genreName)
        .then((result)=>{
            res.send(result)
        })
    // res.send(genre);
});

router.delete('/:id',auth,admin, (req, res)=>{
    const genreId = req.params.id;
    // const genre = genres.find(g => g.id === parseInt(genreId));
    // if(!genre) return res.status(404).send("genre not found");
    // genres.splice(genres.indexOf(genre), 1);
    deleteGenre(genreId)
        .then((result) => {
            res.send(result);
        })
})


module.exports = router;