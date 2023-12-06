const Joi = require('joi');
const mongoose = require('mongoose')
const genreSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})
function validateGenre(request) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(request);
}
const Genre = mongoose.model('Genres', genreSchema)


exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = validateGenre;