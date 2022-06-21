const express = require("express");
const router = express.Router();
const auth = require("./../../middleware/auth");
const User = require("./../../models/User");
const bcrypt = require ('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator');
// check token auth
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Erorr");
  }
});

// check token post user

router.post(
  "/",
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is requided").exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // check user exist
      let user = await User.findOne({ email });

    //   if user no exist
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password,user.password)

      if(!isMatch){
        return res.status(400).json({errors:[{msg:'Invalid Credentials'}]})
      }

      const payload = {
        user:{
            id : user.id
        }
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {expriseIn:'5 days'},
        (err,token) =>{
            if(err) throw err;
            res.json({token})
        }
      )
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
