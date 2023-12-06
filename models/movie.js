const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genre');

const movieSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
})
function validateMovie(request) {
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number(),
        dailyRentalRate: Joi.number()
    });
    return schema.validate(request);
}
const Movie = mongoose.model('Movies', movieSchema)


exports.Movie = Movie;
exports.validateMovie = validateMovie;