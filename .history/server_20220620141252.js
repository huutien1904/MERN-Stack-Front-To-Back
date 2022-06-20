const express = require('express')
const connnectDB = require('./config/db')

const app = express();


connnectDB();
app.get('/',(req,res) =>{
    console.log("tien");
    res.send('API running')
})

// Define Routes

app.use('/api/users',require('./routes/api/users'))
app.use('/api/auth',require('./routes/api/auth'))
app.use('/api/profile',require('./routes/api/profile'))
app.use('/api/posts',require('./routes/api/posts'))
const PORT = process.env.PORT || 5000

app.listen(PORT ,() => console.log(`Server start on port ${PORT}`))