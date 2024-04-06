const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const cors=require("cors");
const { connection } = require("./config/db");
require("dotenv").config()
app.use(cors())
app.use(express.json());
let count = {
    add: 0,
    update: 0
};

let data = []; 

// Middleware to reset count on page reload
app.use((req, res, next) => {
    if (req.method === 'GET' && req.url === '/') {
        count = {
            add: 0,
            update: 0
        };
    }
    next();
});

// API to add or update data
app.post('/data', (req, res) => {
    const { type, newData } = req.body;
    
    if (type === 'add') {
        data = [newData];
        count.add++;
        res.status(200).json({ message: 'Data added successfully' });
    } else if (type === 'update') {
        if (data.length === 0) {
            res.status(400).json({ message: 'No data to update' });
        } else {
            data[0] = newData;
            count.update++;
            res.status(200).json({ message: 'Data updated successfully' });
        }
    } else {
        res.status(400).json({ message: 'Invalid operation type' });
    }
});


app.get('/count', (req, res) => {
    res.status(200).json(count);
});

app.listen(8080, async () => {
    try {
        await connection;
        console.log("Connected to the database");
        
    } catch (err) {
        console.error("Error connecting to the database:", err);
    }
    console.log("Server started on port 8080");
});
