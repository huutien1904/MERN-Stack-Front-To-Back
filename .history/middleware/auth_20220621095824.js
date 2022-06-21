const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function(req,res,next){

    // get token from header 
    const  token = req.header('x-auth-token');

    //  check token
    if(!token){
        return res.status(401).json({msg:'No token , authorization denied'})
    }

    try {
        jwt.verify(token,config.get('jwtSecret'),(error,decoded) =>{
            if(error){
                return res.status(401).json({msg:'Token is not value'});

            }else{
                req.user = decoded.user;
                next()
            }
        })
    } catch (error) {
        console.log(error)
        res.status(5000).json({msg:'Server Error'})
    }
}