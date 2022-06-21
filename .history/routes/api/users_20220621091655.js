const express = require ('express')
const router = express.Router();
const {check,validationResult} = require('express-validator')
const User = require('./../../models/User')
const gravatar = require('gravatar')
const normalize = require('normalize-url');
const jwt = require('jsonwebtoken')
const config = require('config')
// hash passwords.
const bcrypt = require('bcryptjs');

// @route               POST api/users
// @desc                Register user
// @access              Public
router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check('password','Please enter a password with 6 or more characters').isLength({min:6}),
    ],

    async (req,res) =>{
    const errors = validationResult(req)
    console.log(errors);

//    if has error 
    if(!errors.isEmpty()){
            return res.status(400).json({
                errors:errors.array()
            })
    }


    const {name,email,password} = req.body
    
    try {
        let user = await User.findOne({email:email})
        //  if user exist
        if(user){
           return res.status(400).json({errors:[{msg:'User already exists'}]});
        }
        // create avatar
        const avatar = normalize(
            gravatar.url(email,{
                s:'200',
                r:'pg',
                d:'mm'
            }),{forceHttps:true}
        )
        
        user = new User({
            name,
            email,
            avatar,
            password
        })
        // hash passwords by bcrypt
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save()
        console.log("tien",user);

        const payload = {
            user:{
                id:user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn:360000},
            (err,token) =>{
                if(err) throw err;
                res.json({token})
            }
            
            )
        res.send("User route")
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
})


module.exports = router;