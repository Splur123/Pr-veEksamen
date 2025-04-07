const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const authRoutes = require('./Routes/authRoutes.js');
const {connectDB} = require('./Handlers/dbhandler.js');
const session = require('express-session');


app.set('views', path.join(__dirname, 'Views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key', // change this to something secure!
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set true if using HTTPS
  }));
  app.use((req, res, next) => {
    res.locals.loggedIn = !!req.session.userId;
    next();
});
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.render('index');
});


const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
    console.log('Server arghing on ' + PORT);
    connectDB('mongodb://localhost:27017/StøtteDatabase');
});