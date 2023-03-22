const express = require('express');
require('dotenv').config()
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchUser = require('../middleware/fetchUser');
const JWT_SECRET = process.env.JWT_SIGN;
const sendMail = require('../controller/sendMail');



//CREATE A USER USING POST : "/api/auth/createuser"  ===no login required ROUTE1
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid E-mail').isEmail(),
    body('password', 'Password must contain atleast 8 characters').isLength({ min: 8 }), //verify bhi add karna hai
], async (req, res) => {
    let success = false;
    // check validation of bad requests and send errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    // Check user exists with this email already
    try {
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ success, error: "Sorry a user with this email already exists" })
        }
        //password hash and add salt
        const salt = await bcrypt.genSalt(10);
        secPass = await bcrypt.hash(req.body.password, salt);
        //Create User In database
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
            verify: "true"
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }

})


// AUTHENTICATE A USER USING POST: "/api/auth/login".  no login required  ROUTE2

router.post('/login', [
    body('email', 'Enter a valid E-mail').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success = false;

    // check validation of bad requests and send errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server Error");
    }

})


// GET LOGGEDIN USER DETAIL USING POST: "/api/auth/getuser".  login required  ROUTE3
router.post('/getuser', fetchUser, async (req, res) => {

    try {
        let userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server Error");
    }
})

// SEND EMAIL OTP TO VERIFY MAIL USING POST: "/api/auth/mail".  no login required  ROUTE4


router.post('/mail', [
    body('email', 'Enter a valid E-mail').isEmail(),
    body('name', 'Password cannot be blank').exists(),
    body('verify', 'OTP cannot be blank').exists()
], async (req, res) => {
    const { email, name, verify } = req.body;

    try {
        sendMail(email, name, verify).then(result => res.send(result)).catch(error => res.send(error))
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server Error");
    }
})

module.exports = router