const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors'); 

dotenv.config();

const app = express();
app.use(cors()); 
app.use(express.json()); 

const PORT = process.env.PORT || 5000;

const db = mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root', 
    database: process.env.DB_NAME || 'seler_condo_db'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed: ', err.message);
        return;
    }
    console.log('✅ Successfully connected to the SELER_CONDO MySQL Database!');
});

app.post('/api/login', (req, res) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    const sqlQuery = "SELECT * FROM Users WHERE email = ? AND password = ?";
    
    db.query(sqlQuery, [userEmail, userPassword], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Server error" });

        if (results.length > 0) {
            res.json({ success: true, message: `Welcome back, ${results[0].name}!` });
        } else {
            res.json({ success: false, message: "Invalid email or password." });
        }
    });
});

app.post('/api/register', (req, res) => {
    // 1. Get the data sent from the HTML form
    const newName = req.body.name;
    const newEmail = req.body.email;
    const newPassword = req.body.password;
    const newRole = req.body.role;

    // 2. Write the SQL command to INSERT a new row
    const sqlQuery = "INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)";
    
    // 3. Send the command to MySQL
    db.query(sqlQuery, [newName, newEmail, newPassword, newRole], (err, results) => {
        if (err) {
            // MySQL will throw an error if the email already exists! (ER_DUP_ENTRY)
            if (err.code === 'ER_DUP_ENTRY') {
                return res.json({ success: false, message: "That email is already registered!" });
            }
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: "Server error" });
        }

        // If successful, send back a happy message
        res.json({ success: true, message: `Account created successfully for ${newName}!` });
    });
});

app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));