const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if(error) {
        console.log(error.details[0].message);
        return res.status(400).send(error.details[0].message);
    }
    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid Email.');
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid Password.');
    const token = user.generateAuthToken();
    res.send(token);
})
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(8).max(255).required()
    })
    return schema.validate(req);
}
module.exports = router;