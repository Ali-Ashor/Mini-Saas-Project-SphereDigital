// const express = require('express');
// const sqlite3 = require('sqlite3').verbose();
// const session = require('express-session');
// const bodyParser = require('body-parser');

// const app = express();

// /* =========================
//    MIDDLEWARE
// ========================= */

// app.use(bodyParser.urlencoded({ extended:true }));

// app.use(express.static(__dirname));

// app.use(session({
//     secret:'secret-key',
//     resave:false,
//     saveUninitialized:true
// }));

// /* =========================
//    SQLITE DATABASE
// ========================= */

// const db = new sqlite3.Database(
//     './database.db',
//     (err)=>{

//     if(err){
//         console.log(err);
//     }else{
//         console.log("SQLite Connected");
//     }

// });

// /* =========================
//    CREATE TABLES
// ========================= */

// db.serialize(()=>{

// db.run(`
// CREATE TABLE IF NOT EXISTS users(
// id INTEGER PRIMARY KEY AUTOINCREMENT,
// name TEXT,
// email TEXT UNIQUE,
// password TEXT
// )
// `);

// db.run(`
// CREATE TABLE IF NOT EXISTS tasks(
// id INTEGER PRIMARY KEY AUTOINCREMENT,
// task TEXT,
// description TEXT,
// status TEXT,
// userId INTEGER
// )
// `);

// });

// /* =========================
//    HOME
// ========================= */

// app.get('/',(req,res)=>{

// res.redirect('/index.html');

// });

// /* =========================
//    REGISTER
// ========================= */

// app.post('/signup',(req,res)=>{

// const name=req.body.name;
// const email=req.body.email;
// const password=req.body.password;

// db.get(
// "SELECT * FROM users WHERE email=?",
// [email],
// (err,row)=>{

// if(row){

// return res.send(`
// <h2>User Already Exists</h2>
// <a href="/signup.html">
// Go Back
// </a>
// `);

// }

// db.run(

// "INSERT INTO users(name,email,password) VALUES(?,?,?)",

// [name,email,password],

// (err)=>{

// if(err){

// console.log(err);

// }else{

// res.redirect('/index.html');

// }

// }

// );

// });

// });

// /* =========================
//    LOGIN
// ========================= */

// app.post('/login',(req,res)=>{

// const email=req.body.email;
// const password=req.body.password;

// db.get(

// "SELECT * FROM users WHERE email=? AND password=?",

// [email,password],

// (err,user)=>{

// if(err){

// console.log(err);

// return res.send("Database Error");

// }

// if(user){

// req.session.user=user;

// res.redirect('/dashboard');

// }else{

// res.send(`
// <h2>Invalid Login</h2>

// <a href="/index.html">

// Try Again

// </a>
// `);

// }

// });

// });

// /* =========================
//    DASHBOARD
// ========================= */

// app.get('/dashboard',(req,res)=>{

// if(!req.session.user){

// return res.redirect('/index.html');

// }

// db.all(

// "SELECT * FROM tasks WHERE userId=?",

// [req.session.user.id],

// (err,rows)=>{

// let taskRows='';

// rows.forEach(task=>{

// taskRows += `

// <tr>

// <td>${task.id}</td>

// <td>${task.task}</td>

// <td>${task.description}</td>

// <td>

// <span class="status ${
// task.status=='Pending'
// ? 'pending'
// : 'completed'
// }">

// ${task.status}

// </span>

// </td>

// <td>

// <a href="/delete/${task.id}"
// class="delete-btn">

// Delete

// </a>

// </td>

// </tr>

// `;

// });

// res.send(`

// <!DOCTYPE html>
// <html lang="en">
// <head>

// <meta charset="UTF-8">

// <meta name="viewport"
// content="width=device-width, initial-scale=1.0">

// <title>Dashboard</title>

// <style>

// *{
// margin:0;
// padding:0;
// box-sizing:border-box;
// font-family:Arial,sans-serif;
// }

// body{
// background:#f4f6f9;
// }

// .navbar{
// width:100%;
// background:#007bff;
// padding:15px;
// color:white;
// font-size:22px;
// }

// .logout{
// float:right;
// color:white;
// text-decoration:none;
// font-size:16px;
// margin-top:4px;
// }

// .container{
// width:90%;
// margin:30px auto;
// }

// .card{
// background:white;
// padding:20px;
// border-radius:10px;
// box-shadow:0 0 10px rgba(0,0,0,0.1);
// margin-bottom:20px;
// }

// .card h2{
// margin-bottom:15px;
// color:#333;
// }

// .input-box{
// margin-bottom:15px;
// }

// .input-box input,
// .input-box textarea,
// .input-box select{
// width:100%;
// padding:10px;
// border:1px solid #ccc;
// border-radius:5px;
// outline:none;
// }

// .btn{
// background:#007bff;
// color:white;
// padding:10px 20px;
// border:none;
// border-radius:5px;
// cursor:pointer;
// }

// .btn:hover{
// background:#0056b3;
// }

// table{
// width:100%;
// border-collapse:collapse;
// margin-top:20px;
// }

// table th,
// table td{
// border:1px solid #ddd;
// padding:12px;
// text-align:left;
// }

// table th{
// background:#007bff;
// color:white;
// }

// .status{
// padding:5px 10px;
// border-radius:5px;
// color:white;
// font-size:14px;
// }

// .pending{
// background:orange;
// }

// .completed{
// background:green;
// }

// .delete-btn{
// color:red;
// text-decoration:none;
// font-weight:bold;
// }

// </style>

// </head>

// <body>

// <div class="navbar">

// Mini SaaS Dashboard

// <a href="/logout"
// class="logout">

// Logout

// </a>

// </div>

// <div class="container">

// <div class="card">

// <h2>

// Welcome ${req.session.user.name}

// </h2>

// <form action="/add-task"
// method="POST">

// <div class="input-box">

// <input
// type="text"
// name="task"
// placeholder="Project Title"
// required>

// </div>

// <div class="input-box">

// <textarea
// name="description"
// rows="4"
// placeholder="Project Description">

// </textarea>

// </div>

// <div class="input-box">

// <select name="status">

// <option>Pending</option>

// <option>Completed</option>

// </select>

// </div>

// <button type="submit"
// class="btn">

// Save Project

// </button>

// </form>

// </div>

// <div class="card">

// <h2>Project List</h2>

// <table>

// <tr>

// <th>ID</th>

// <th>Title</th>

// <th>Description</th>

// <th>Status</th>

// <th>Action</th>

// </tr>

// ${taskRows}

// </table>

// </div>

// </div>

// </body>
// </html>

// `);

// });

// });

// /* =========================
//    ADD TASK
// ========================= */

// app.post('/add-task',(req,res)=>{

// if(!req.session.user){

// return res.redirect('/index.html');

// }

// const task=req.body.task;
// const description=req.body.description;
// const status=req.body.status;

// db.run(

// `INSERT INTO tasks(
// task,
// description,
// status,
// userId
// )

// VALUES(?,?,?,?)`,

// [
// task,
// description,
// status,
// req.session.user.id
// ],

// (err)=>{

// if(err){

// console.log(err);

// }

// res.redirect('/dashboard');

// }

// );

// });

// /* =========================
//    DELETE TASK
// ========================= */

// app.get('/delete/:id',(req,res)=>{

// db.run(

// "DELETE FROM tasks WHERE id=?",

// [req.params.id],

// ()=>{

// res.redirect('/dashboard');

// }

// );

// });

// /* =========================
//    LOGOUT
// ========================= */

// app.get('/logout',(req,res)=>{

// req.session.destroy();

// res.redirect('/index.html');

// });

// /* =========================
//    SERVER
// ========================= */

// app.listen(3000,()=>{

// console.log(
// "Server Running : http://localhost:3000"
// );

// });


























const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

/* =========================
   SQLITE DATABASE
========================= */

const db = new sqlite3.Database('./database.db', (err) => {

    if (err) {
        console.log(err);
    } else {
        console.log("SQLite Connected");
    }

});

/* =========================
   CREATE TABLES
========================= */

db.serialize(() => {

    db.run(`
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
    )
    `);

    db.run(`
    CREATE TABLE IF NOT EXISTS tasks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task TEXT,
        description TEXT,
        status TEXT,
        userId INTEGER
    )
    `);

});

/* =========================
   HOME
========================= */

app.get('/', (req, res) => {

    res.redirect('/index.html');

});

/* =========================
   REGISTER
========================= */

app.post('/signup', (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    db.get(
        "SELECT * FROM users WHERE email=?",
        [email],
        (err, row) => {

            if (row) {

                return res.send(`
                <h2>User Already Exists</h2>
                <a href="/signup.html">Go Back</a>
                `);

            }

            db.run(
                "INSERT INTO users(name,email,password) VALUES(?,?,?)",
                [name, email, password],
                (err) => {

                    if (err) {

                        console.log(err);

                    } else {

                        res.redirect('/index.html');

                    }

                }
            );

        }
    );

});

/* =========================
   LOGIN
========================= */

app.post('/login', (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    db.get(
        "SELECT * FROM users WHERE email=? AND password=?",
        [email, password],
        (err, user) => {

            if (err) {

                console.log(err);
                return res.send("Database Error");

            }

            if (user) {

                req.session.user = user;

                res.redirect('/dashboard');

            } else {

                res.send(`
                <h2>Invalid Login</h2>
                <a href="/index.html">Try Again</a>
                `);

            }

        }
    );

});

/* =========================
   DASHBOARD
========================= */

app.get('/dashboard', (req, res) => {

    if (!req.session.user) {

        return res.redirect('/index.html');

    }

    db.all(
        "SELECT * FROM tasks WHERE userId=?",
        [req.session.user.id],
        (err, rows) => {

            if (err) {

                console.log(err);
                return res.send("Database Error");

            }

            let taskRows = '';

            if (rows.length === 0) {

                taskRows = `
                <tr>
                    <td colspan="5" style="text-align:center;">
                        No Projects Found
                    </td>
                </tr>
                `;

            } else {

                rows.forEach(task => {

                    taskRows += `

                    <tr>

                        <td>${task.id}</td>

                        <td>${task.task}</td>

                        <td>${task.description}</td>

                        <td>

                            <span class="status ${task.status == 'Pending'
                                ? 'pending'
                                : 'completed'
                            }">

                                ${task.status}

                            </span>

                        </td>

                        <td>

                            <a href="/delete/${task.id}" class="delete-btn">

                                Delete

                            </a>

                        </td>

                    </tr>

                    `;

                });

            }

            res.send(`

<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>Dashboard</title>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:Arial,sans-serif;
}

body{
background:#f4f6f9;
}

.navbar{
width:100%;
background:#007bff;
padding:15px;
color:white;
font-size:22px;
}

.logout{
float:right;
color:white;
text-decoration:none;
font-size:16px;
margin-top:4px;
}

.container{
width:90%;
margin:30px auto;
}

.card{
background:white;
padding:20px;
border-radius:10px;
box-shadow:0 0 10px rgba(0,0,0,0.1);
margin-bottom:20px;
}

.card h2{
margin-bottom:15px;
color:#333;
}

.input-box{
margin-bottom:15px;
}

.input-box input,
.input-box textarea,
.input-box select{
width:100%;
padding:10px;
border:1px solid #ccc;
border-radius:5px;
outline:none;
}

.btn{
background:#007bff;
color:white;
padding:10px 20px;
border:none;
border-radius:5px;
cursor:pointer;
}

.btn:hover{
background:#0056b3;
}

table{
width:100%;
border-collapse:collapse;
margin-top:20px;
}

table th,
table td{
border:1px solid #ddd;
padding:12px;
text-align:left;
}

table th{
background:#007bff;
color:white;
}

.status{
padding:5px 10px;
border-radius:5px;
color:white;
font-size:14px;
}

.pending{
background:orange;
}

.completed{
background:green;
}

.delete-btn{
color:red;
text-decoration:none;
font-weight:bold;
}

</style>

</head>

<body>

<div class="navbar">

Mini SaaS Dashboard

<a href="/logout" class="logout">

Logout

</a>

</div>

<div class="container">

<div class="card">

<h2>

Welcome ${req.session.user.name}

</h2>

<form action="/add-task" method="POST">

<div class="input-box">

<input
type="text"
name="task"
placeholder="Project Title"
required>

</div>

<div class="input-box">

<textarea
name="description"
rows="4"
placeholder="Project Description"></textarea>

</div>

<div class="input-box">

<select name="status">

<option>Pending</option>

<option>Completed</option>

</select>

</div>

<button type="submit" class="btn">

Save Project

</button>

</form>

</div>

<div class="card">

<h2>Project List</h2>

<table>

<tr>

<th>ID</th>

<th>Title</th>

<th>Description</th>

<th>Status</th>

<th>Action</th>

</tr>

${taskRows}

</table>

</div>

</div>

</body>
</html>

            `);

        }
    );

});

/* =========================
   ADD TASK
========================= */

app.post('/add-task', (req, res) => {

    if (!req.session.user) {

        return res.redirect('/index.html');

    }

    const task = req.body.task;
    const description = req.body.description;
    const status = req.body.status;

    db.run(
        `INSERT INTO tasks(
            task,
            description,
            status,
            userId
        )
        VALUES(?,?,?,?)`,
        [
            task,
            description,
            status,
            req.session.user.id
        ],
        (err) => {

            if (err) {

                console.log(err);
                return res.send("Task Insert Error");

            }

            console.log("Task Added Successfully");

            res.redirect('/dashboard');

        }
    );

});

/* =========================
   DELETE TASK
========================= */

app.get('/delete/:id', (req, res) => {

    db.run(
        "DELETE FROM tasks WHERE id=?",
        [req.params.id],
        (err) => {

            if (err) {

                console.log(err);

            }

            res.redirect('/dashboard');

        }
    );

});

/* =========================
   LOGOUT
========================= */

app.get('/logout', (req, res) => {

    req.session.destroy();

    res.redirect('/index.html');

});

/* =========================
   SERVER
========================= */

app.listen(3000, () => {

    console.log(
        "Server Running : http://localhost:3000"
    );

});