const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/keys');
const fetchuser = require('../middleware/fetchuser');

// Route to Signup a new User

router.post('/signup', [
    body('email', "Enter a Valid Email").isEmail(),
    body('password', "The Password should have at least 8 Characters").isLength({ min: 8 }),
], async (req, res) => {
    // returns bad request, if there is an error! 
    let success = false;

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }

        // Check if user already exists!

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "User already registered!" })
        }

        // generating hashed password with salt

        const salt = await bcrypt.genSalt(10);
        const secPassKey = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: secPassKey,
        })

        const data = {
            user: {
                id: user.id
            }
        }
        const secToken = jwt.sign(data, JWT_SECRET);
        console.log(secToken);
        success = true;
        res.json({ success, secToken })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Unexpected error occured");
    }
})

// To Authenticate Login Request of the User

router.post('/signin', [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password Cannot be Blank").exists(),
], async (req, res) => {
    let success = false;
    // return errors on Invalid Request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body; //extracts email and password from request
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Enter Valid Credentials" });
        }

        const comparePass = await bcrypt.compare(password, user.password);

        if (!comparePass) {
            return res.status(400).json({ success, error: "Enter Valid Credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }

        const secToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, secToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Route to Find out details of the user

router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;