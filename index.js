import express from 'express'
import morgan from 'morgan';
import dotenv from 'dotenv'
import dbConection from './utils/dbConection.js'
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser"


import cors from 'cors'

dotenv.config() // evn file
const app = express() // aceess express

app.use(express.json()) // acess to json
app.use(express.urlencoded({ extended: true })) // acess to url in spcecial format 

app.use(cookieParser())

const port = process.env.PORT || 5000 // por number defined


// 2. CORS configuration
app.use(
    cors({
        origin: "http://localhost:5173", // Match your frontend URL exactly
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Accept"],
        exposedHeaders: ["Set-Cookie", "*"],
    })
);

app.use(morgan("dev"));

app.get('/', (req, res) => {
    res.send('Hello World! jitndra mandal') // home page
})

app.use("/api/v1/users", userRouter);//uesd user routerh  

dbConection() // database conection

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`) // port number
})