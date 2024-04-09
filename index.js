import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 5000; // Use PORT environment variable or default to 5000
const DATABASE_URL = process.env.DATABASE_URL
const app = express()
app.use(express.json());

app.get('/', (req, res) => {
    res.send("welcome to blog/post api")
    // res.send(quotes)
    // res.send("hello")
});

mongoose.connect(DATABASE_URL).then(()=>{
        app.listen(PORT, ()=>{
            console.log("listening on port",PORT)
        
        });
    })

