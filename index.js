import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import shortUrl from './routes/route.js';

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use("/", shortUrl);
app.get('/', (req, res) => {
    res.status(200).json({
        "Message": "Server is OK"
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const port = process.env.PORT || 3000;

// Validate environment variables
if (!port) {
    console.error("PORT environment variable is not defined.");
    process.exit(1);
}

if (!process.env.DB_URL) {
    console.error("DB_URL environment variable is not defined.");
    process.exit(1);
}

mongoose.set('strictQuery', false);

async function Main() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to database');
        app.listen(port, () => console.log(`App is listening on port ${port}`));
    } catch (error) {
        console.error('Error connecting to database:', error.message);
    }
}

Main();
