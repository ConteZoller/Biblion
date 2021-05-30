'use strict';

const express = require('express');
const router = express.Router();
const {db, hashString} = require('../utils');
const { dbUrl, dbName, dbCollection } = require('../config');

const Book = require('../models/book')



router.get('/', async (req, res, next) => {
    if(req.session.user) {
        let books
        try {
            books = await Book.find().sort({ createdAt: 'desc' }).limit(5).exec()
        } catch {
            books = []
        }

        res.render('index', { books: books });
    } else {
        res.redirect('/auth');
    }
});

router.get('/auth', (req, res, next) => {
    res.render('users/login', { user:  req.session.user ? req.session.user : null } );
});


router.get('/new', (req, res, next) => {
    res.render('users/signup');
});

router.get('/account', (req, res, next) => {
    if(req.session.user) {
        res.render('users/account');
    } else {
        res.sendStatus(403);
    }
});

router.get('/logout', (req, res, next) => {
    if(req.session.user) {
        delete req.session.user;
        res.redirect('/');
    } else {
        res.sendStatus(403);
    }
});

router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const client = await db(dbUrl);
        const database = client.db(dbName);
        const users = database.collection(dbCollection);
        const existingUser = await users.findOne({email: email, password: hashString(password)});
        if(existingUser) {
            req.session.user = existingUser;
            res.json({ success: true });
        } else {
            res.json({ error: 'Invalid login.' }); 
        }

    } catch(err) {
        res.json({ error: 'Connection error.' });
    }
});


module.exports = router;