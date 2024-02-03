const Joi = require('joi')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    email:{
        type:String,
        unique: true,
        minlength: 5,
        maxlength: 255,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    },
    isAdmin: Boolean
});

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(8).max(255).required()
    })
    return schema.validate(user);
}
userSchema.methods.generateAuthToken = function () {
    console.log('generating token');
    const token = jwt.sign({'_id': this._id, 'isAdmin': this.isAdmin}, config.get('jwtPrivateKey')); // generates a JSON web token to be returned.
    // It takes a payload and a private key as arguments. NEVER HARD CODE A PRIVATE KEY!! Instead store it in an environment variable.
    // SET vidly_jwtPrivateKey=...
    console.log(token);
    return token;
};


const User = mongoose.model('Users', userSchema);

exports.User = User;
exports.validateUser = validateUser;