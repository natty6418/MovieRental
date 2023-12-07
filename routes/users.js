const {User, validateUser} = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth') //...authorization
async function addUser(req){
    const user  = new User({
        name: req.name,
        email: req.email,
        password: req.password
    });
    const salt = await bcrypt.genSalt(5);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save()
    return user;
}

router.get('/me', auth, async (req, res) => {
    const user =await User.findById(req.user._id).select('-password');
    res.send(user);
})

router.post('/', async (req, res) => {
    const {error} = validateUser(req.body);
    if(error) {
        console.log(error.details[0].message);
        return res.status(400).send(error.details[0].message);
    }
    const user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('Email already exists.');
    const newUser = await addUser(_.pick(req.body, ['name', 'email', 'password']));
    const token = newUser.generateAuthToken()
    res.header('x-auth-token', token).send(_.pick(newUser, ['_id','name', 'email']));
})

module.exports = router;