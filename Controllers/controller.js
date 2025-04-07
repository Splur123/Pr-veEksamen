const express = require('express');
const bcrypt = require('bcryptjs');
const user = require('../Models/user');
const ticket = require('../Models/ticket');
const { receiveMessageOnPort } = require('worker_threads');
const { userInfo } = require('os');


const authController = {

    renderUser: async (req, res) => {
        const currentUser = await user.findById(req.session.userId);
        res.render('user', { currentUser });
    },

    renderRegister: (req, res) => {
        res.render('register');
    },

    register: async (req, res) => {

        try {
            if (req.body.password === req.body.confirmPassword ) {
                const existingUser = await user.findOne({email: req.body.email});

                if(!existingUser){
                    await user.create({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                        admin: false
                    })
                    res.redirect('/');
                }
                else {
                    res.status(201).send('User already exists');
                }

            } else {
                res.status(201).send('Passwords dont match');
            }
        }
        
        catch (error) {
                console.log(error);
            }
    },

    renderLogin: (req, res) => {
        res.render('login');
    },

    login: async (req, res) => {
        const existingUser = await user.findOne({email: req.body.email});

            console.log('authenticating...');

            try {
            if ( await bcrypt.compare(req.body.password, existingUser.password)){
                req.session.userId = existingUser._id;
                res.redirect('/');
            }
            else {
                res.status(201).send("couldn't find account");
            }
        }

            catch (error) {
                console.log(error);
            }
        },

        logout: (req, res) => {
            req.session.destroy(err => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Couldn't log out");
                }
                res.redirect('/');
            });
        },

        renderTicketRegister: (req, res) => {
            res.render('ticketRegister');
        },

        ticketRegister: async (req, res) => {

            const currentUser = await user.findById(req.session.userId);

            try {

                    await ticket.create({
                        name: req.body.name,
                        description: req.body.description,
                        status: 0,
                        user: currentUser
                    })
                    res.redirect('/');
                }

            catch (error) {
                    console.log(error);
                }
        },

        requireLogin (req, res, next) {
            if (!req.session.userId) {
              return res.redirect('/auth/login');
            }
            next();
          }
    };

module.exports = authController;