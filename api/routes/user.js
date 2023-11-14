const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const emailValidationCheck = (userData) => {
    const matches = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email);
    if (!matches) {
        return { status: 400, errors: { message: "Invalid Email format" } }
    }
    let userDetails = User.findOne({ email: userData.email.toLowerCase() }).exec()
        .then(data => {
            if (data) {
                return { status: 400, errors: { message: "Entered Email is already exists" } }
            }
        })
        .catch(err => {
            return { status: 400, errors: { message: err } }
        })
    return userDetails
};

const finalData = (data, token) => {
    return {
        username: data.name,
        access_token: token
    }
}

router.post('/register', async (req, res) => {
    let userData = req.body;
    let data = await emailValidationCheck(userData)
    if (data?.status == 400) {
        return res.status(data.status).send(data.errors)
    }
    userData.email = userData.email.toLowerCase()
    let user = new User(userData);
    user.save()
        .then((data) => {
            let payload = { subject: data._id };
            let token = jwt.sign(payload, "mySecretKey");
            let finalResult = finalData(data, token)
            return res.status(201).send({ data: finalResult });
        })
        .catch((err) => {
            console.log({ status: 201, data: err });
            return res.status(400).send({ errors: { message: err } });
        });
});

router.post('/login', (req, res) => {
    let userData = req.body
    User.findOne({ email: userData.email.toLowerCase() }).exec()
        .then((data) => {
            if (!data) {
                return res.status(404).send({ errors: { message: "No record found" } })
            }
            else if (data.password !== userData.password) {
                return res.status(400).send({ errors: { message: 'Invalid Password' } })
            }
            else {
                let payload = { subject: data._id }
                let token = jwt.sign(payload, "mySecretKey")
                let finalResult = finalData(data, token)
                return res.status(201).send({ data: finalResult })
            }
        })
        .catch(err => {
            console.log(err);
            return res.send({ status: 400, errors: { message: err } })
        })
})

module.exports = router