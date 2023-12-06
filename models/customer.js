const Joi = require('joi');
const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
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
        type: Number,
        minlength: 10,
        required: true
    }
});

const Customer = mongoose.model('customer', CustomerSchema);

function validateCustomer(request) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
      isGold: Joi.boolean().required(),
      phone: Joi.number().min(10).required()
    });
  
    return schema.validate(request);
  }

exports.Customer = Customer;
exports.validate = validateCustomer;