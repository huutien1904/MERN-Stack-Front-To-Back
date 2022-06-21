const express = require ('express')
const router = express.Router();
const auth = require('./../../middleware/auth')
const User = require('./../../models/User')


// get user by token
router.get('/',auth,(req,res) =>{
   try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
   } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Erorr');
   }
})


module.exports = router;