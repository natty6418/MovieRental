const express = require('express');
const router = express.Router(); //router is a function in express module used to create a new router object
const mongoose = require('mongoose');
const {Customer, validate} = require('../models/customer');

router.use(express.json());
   

async function addCustomer(req) {
    const customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });

    try {
        const result = await customer.save()
        return result;
    }
    catch (ex) {
        for (err in ex.errors)
            console.log(ex.errors[err].message)
    }
}

async function getCustomer() {
    // console.log("here")
    try {
        const result = await Customer
            .find()
            .limit(10)
        // console.log("result", result)
        return result
    }
    catch (ex) {
        for (err in ex.errors)
            console.log(ex.errors[err].message)
    }
}
async function getCustomerById(req) {
    try {
        const result = await Customer
            .find({ _id: req.params.id })
        return result
    }
    catch (ex) {
        for (err in ex.errors)
            console.log(ex.errors[err].message)
    }
}
async function updateCustomer(req) {
    try {
        const result = await Customer.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name || this.name,
                isGold: req.body.isGold || this.isGold,
                phone: req.body.phone || this.phone
            },
        },
        {new: true})
        return result
    }
    catch (ex) {
        for (err in ex.errors)
            console.log(ex.errors[err].message)
    }
}
async function deleteCustomer(req) {
    try {
        return await Customer.deleteOne({ _id: req.params.id });
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

router.get('/', (req, res) => {
    getCustomer()
        .then((result) => {
            console.log(result)
            res.send(result)
        })
})
router.get('/:id', (req, res) => {
    getCustomerById(req)
        .then((result) => {
            console.log(result)
            res.send(result)
        })
})
router.post('/', (req, res) => {

    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    // const genre = {
    //     id: genres.length +1,
    //     name: req.body.name
    // }
    // genres.push(genre);
    addCustomer(req)
        .then((result) => {
            res.send(result)
        })
})
// router.get('/:id', (req, res) => {
//     getCustomerById(req)
//         .then((result) => {
//             console.log(result)
//             res.send(result)
//         })
//     // let genre = genres.find(g => g.id === parseInt(genreId));
//     // if(!genre) return res.status(404).send("genre not found");
// });
router.put('/:id', (req, res) => {
    // const genre = genres.find(g => g.id === parseInt(genreId));
    // if(!genre) return res.status(404).send("genre not found");

    // const { error } = validate(req.body);
    // if (error) {
    //     return res.status(400).send(error.details[0].message);
    // }
    // genre.name = req.body.name;

    updateCustomer(req)
        .then((result) => {
            res.send(result)
        })
    // res.send(genre);
});

router.delete('/:id', (req, res) => {
    // const genre = genres.find(g => g.id === parseInt(genreId));
    // if(!genre) return res.status(404).send("genre not found");
    // genres.splice(genres.indexOf(genre), 1);
    deleteCustomer(req)
        .then((result) => {
            res.send(result);
        })
})


module.exports = router;