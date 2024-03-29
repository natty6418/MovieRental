const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genre')

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
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
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255 
            },
            dateOut: {
                type: Date,
                required: true,
                default: Date.now
            },
            dateReturned: {
                type: Date
            },
            retalFee: {
                type: Number,
                min: 0
            }
        }),
        required: true
    }
});

function validateRental(rental) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });

    return schema.validate(rental)
}
const Rental = mongoose.model('Rentals', rentalSchema);

exports.Rental = Rental
exports.validateRental = validateRental