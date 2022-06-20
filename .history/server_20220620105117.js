const express = require('express')

const app = express();
app.get('/',(req,res) =>{
    console.log(req);
    console.log("tien");
    res.send('API running')
})
const PORT = process.env.PORT || 5000

app.listen(PORT ,() => console.log(`Server start on port ${PORT}`))