const express = require('express');
const bcrypt = require('bcryptjs');
const user = require('../Models/user');
const ticket = require('../Models/ticket');
const faq = require("../Models/faq");
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
                //req.session.role = existingUser.role;
                req.session.user = existingUser;
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
                        status: "Open",
                        priority: "No Priority",
                        ownerId: req.session.userId,
                        ownerName: currentUser.name
                    })
                    res.redirect('/auth/tickets');
                }

            catch (error) {
                    console.log(error);
                }
        },

        renderTickets: async (req, res) => {
            try {
              const { status, priority } = req.query;
              const currentUser = await user.findById(req.session.userId);
          
              if (!currentUser) return res.status(404).send("User not found.");
          
              let query = {};
              if (status) query.status = status;
              if (priority) query.priority = priority;
              if (currentUser.role !== 'Admin') query.ownerId = req.session.userId;
          
              const filteredTickets = await ticket.find(query).sort({ createdAt: -1 });;
          
              res.render('tickets', {
                tickets: filteredTickets,
                currentUser,
                role: currentUser.role,
                selectedFilters: { status, priority }
              });
            } catch (error) {
              console.error(error);
              res.status(500).send('Server error.');
            }
          },

        answerTicket: async (req, res) => {
            const ticketId = req.params.id;
            const currentUser = await user.findById(req.session.userId);
          
            try {
              await ticket.findByIdAndUpdate(ticketId, {
                answer: req.body.answer,
                status: req.body.status,
                priority: req.body.priority,
                answerer: currentUser.name
              });
          
              res.redirect('/auth/tickets');
            } catch (err) {
              console.error('Error answering ticket:', err);
              res.status(500).send('Something went wrong while answering the ticket.');
            }
          },

          deleteTicket: async (req, res) => {
            const ticketId = req.params.id;
          
            try {
                await ticket.deleteOne({ _id: ticketId });
          
              res.redirect('/auth/tickets');
            } catch (err) {
              console.error('Error deleting ticket:', err);
              res.status(500).send('Something went wrong while deleting the ticket.');
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

        renderFaq: async (req, res) => {
            try {
                
                const role = req.session.user?.role || "User";
                let faqs;
            
                if (role === "Admin") {
                  faqs = await faq.find().sort({ createdAt: -1 });
                } else {
                  faqs = await faq.find({ answered: true }).sort({ createdAt: -1 });
                }
            
                res.render("faq", { faqs, role });
              } catch (err) {
                console.error("Error rendering FAQ page:", err);
                res.status(500).send("Internal Server Error");
              }
        },

        faqSubmit: async (req, res) => {

            try {
                if (req.body.answer != "" || null) {
                
                    await faq.create({
                        question: req.body.question,
                        answer: req.body.answer,
                        answered: true
                    })
                }
                else {
                    await faq.create({
                        question: req.body.question,
                        answer: req.body.answer,
                        answered: false
                })
            }
                    res.redirect('/auth/faq');
                }

            catch (error) {
                    console.log(error);
                }
        },

        updateFaq: async (req, res) => {

            const faqId = req.params.id;

            try {

                if (req.body.answer != "" || null) {

                    await faq.findByIdAndUpdate(faqId, {
                        question: req.body.question,
                        answer: req.body.answer,
                        answered: false
                    })
                }
                else {
                        await faq.findByIdAndUpdate(faqId, {
                            question: req.body.question,
                            answer: req.body.answer,
                            answered: true
                    })
                    res.redirect('/auth/faq');
                }
            }
            catch (error) {
                    console.log(error);
                }
        },

        deleteFaq: async (req, res) => {
            const faqId = req.params.id;
          
            try {
                await faq.deleteOne({ _id: faqId });
          
              res.redirect('/auth/faq');
            } catch (err) {
              console.error('Error deleting faq:', err);
              res.status(500).send('Something went wrong while deleting the faq.');
            }
          },

          renderManual: async (req, res) => {
            res.render('manual')
          },

        requireLogin (req, res, next) {
            if (!req.session.userId) {
              return res.redirect('/auth/login');
            }
            next();
          }
    };

module.exports = authController;