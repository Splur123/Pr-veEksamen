const express = require('express');
const bcrypt = require('bcryptjs');
const user = require('../Models/user');
const ticket = require('../Models/ticket');
const { receiveMessageOnPort } = require('worker_threads');
const { userInfo } = require('os');


const authController = {

    renderUser: async (req, res) => {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }
    
        try {
            const currentUser = await user.findById(req.session.userId);
            res.render('user', { currentUser });
        } catch (err) {
            console.error(err);
            res.status(500).send('Something went wrong.');
        }
    },

    renderRegister: async (req, res) => {
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
                        role: "User"
                    })
                    console.log("user registered");
                    res.redirect('/');
                }
                else {
                    res.redirect('/auth/register');
                }

            } else {
                res.redirect('/auth/register');
            }
        }
        
        catch (error) {
                console.log(error);
            }
    },

    renderLogin: async (req, res) => {
        res.render('login');
    },

    login: async (req, res) => {
        const existingUser = await user.findOne({email: req.body.email});

            console.log('authenticating...');

            try {
            if ( await bcrypt.compare(req.body.password, existingUser.password)){
                req.session.userId = existingUser._id;
                req.session.role = existingUser.role;
                console.log("successfully logged in");
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

        logout: async (req, res) => {
            req.session.destroy(err => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Couldn't log out");
                }
                res.redirect('/');
            });
        },

        renderTicketRegister: async (req, res) => {
            res.render('ticketRegister');
        },

        ticketRegister: async (req, res) => {

            const currentUser = await user.findById(req.session.userId);

            try {

                    await ticket.create({
                        name: req.body.name,
                        description: req.body.description,
                        answer: "",
                        category: req.body.category,
                        status: "Not Started",
                        priority: "None",
                        ownerId: req.session.userId,
                        ownerName: currentUser.name
                    })
                    res.redirect('/');
                }

            catch (error) {
                    console.log(error);
                }
        },

        renderTickets: async (req, res) => {
            try {
                const currentUser = await user.findById(req.session.userId);
        
                if (!currentUser) {
                    return res.status(404).send("User not found.");
                }
        
                const allTickets = await ticket.find();
        
                const visibleTickets = currentUser.role === 'Admin'
                    ? allTickets
                    : allTickets.filter(t => t.ownerId?.toString() === req.session.userId);
        
                res.render('tickets', { tickets: visibleTickets, currentUser });
            } catch (error) {
                console.error(error);
                res.status(500).send('Server error.');
            }
        },

        answerTicket: async (req, res) => {
            const ticketId = req.params.id;
            const { answer, status, priority } = req.body;
            const currentUser = await user.findById(req.session.userId);
          
            try {
              await ticket.findByIdAndUpdate(ticketId, {
                answer: answer,
                status: status,
                priority: priority,
                answerer: currentUser.name
              });
          
              res.redirect('/auth/tickets');
            } catch (err) {
              console.error('Error answering ticket:', err);
              res.status(500).send('Something went wrong while answering the ticket.');
            }
          },

        renderAdmin: async (req, res) => {
            try {
                const open = await ticket.countDocuments({ status: 'Open' });
                const inProgress = await ticket.countDocuments({ status: 'In Progress' });
                const solved = await ticket.countDocuments({ status: 'Solved' });
            if (req.session.role === "Admin") {
                res.render('adminDashboard', {
                    open,
                    inProgress,
                    solved
                });
              }
            else {
                return res.redirect('/');
            }
        }   catch (error) {
            console.log(error);
            res.status(500).send("Error fetching ticket data");
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