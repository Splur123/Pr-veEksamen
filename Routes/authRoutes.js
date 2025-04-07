const express = require('express');
const router = express.Router();
const authController = require('../Controllers/controller');


router.get('/register', authController.renderRegister);
router.get('/ticketregister', authController.requireLogin, authController.renderTicketRegister);
router.get('/login', authController.renderLogin);
router.get('/logout', authController.logout);
router.get('/user', authController.requireLogin, authController.renderUser);

router.post('/register', authController.register);
router.post('/ticketregister', authController.ticketRegister);
router.post('/login', authController.login);

module.exports = router;