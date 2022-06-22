const mongoose = require ('mongoose')
//  middleware to check for a valid object id 

const checkObjectId = (idToCheck) => (req,res,next) =>{
    console.log(idToCheck)
    if(!mongoose.Types.ObjectId.isValid(req.params[idToCheck]))
    return res.status(400).json({msg:"Invalid ID"})
}
module.exports = checkObjectId