require('dotenv').config();
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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));
  app.use((req, res, next) => {
    // res.locals.loggedIn = !!req.session.userId;
    // res.locals.role = req.session.user?.role
    // res.locals.user = req.session.user
    res.locals.loggedIn = !!req.session.userId;
    res.locals.role = req.session.user?.role
    res.locals.user = req.session.user
    next();
});
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.render('index');
});


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log('Server arghing on port ' + PORT);
    connectDB(process.env.MONGODB_URI);
});