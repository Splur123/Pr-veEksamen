const express = require('express');
const router = express.Router();
const authController = require('../Controllers/controller');


router.get('/register', authController.renderRegister);
router.get('/ticketregister', authController.requireLogin, authController.renderTicketRegister);
router.get('/login', authController.renderLogin);
router.get('/logout', authController.requireLogin, authController.logout);
router.get('/user', authController.requireLogin, authController.renderUser);
router.get('/tickets', authController.requireLogin, authController.renderTickets);
router.get('/admin', authController.requireLogin, authController.renderAdmin);
router.get('/faq', authController.requireLogin, authController.renderFaq);
router.get('/manual', authController.requireLogin, authController.renderManual);


router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/ticketregister', authController.ticketRegister);
router.post('/answerTicket/:id', authController.answerTicket);
router.post('/deleteTicket/:id', authController.deleteTicket);
router.post('/faqSubmit', authController.faqSubmit);
router.post('/updateFaq', authController.updateFaq);
router.post('/deleteFaq', authController.deleteFaq);

module.exports = router;