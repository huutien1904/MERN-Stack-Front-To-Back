const mongoose = require('mongoose')
const config = require('config')

const db = config.get("mongoURI")

const connectDB =  () =>{
    try {
        
         mongoose.connect(db);
      
        onsole.log('MongoDB Connected...');
    } catch (error) {
        console.error(error.message);
        process.exit(1)
    }
}

module.exports = connectDB