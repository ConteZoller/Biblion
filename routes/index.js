'use strict';
const User = require('../models/user')

var express = require('express');
var router = express.Router();

const {db, hashString} = require('../utils');
const { dbUrl, dbName, dbCollection } = require('../config');

const Book = require('../models/book');

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
    res.render('users/login', { 
        layout: 'layouts/fit',
        user:  req.session.user ? req.session.user : null
    });
});


router.get('/signup', (req, res, next) => {
    res.render('users/signup', { user: new User() });
});

router.post('/signup',  async (req, res) => {
    const email = req.body.email;
    try {
        const client = await db(dbUrl);
        const database = client.db(dbName);
        const users = database.collection(dbCollection);
        const existingUser = await users.findOne({email: email});  //controllo solo che non ci siano account con la stessa email
        if(!existingUser) {
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                type: req.body.type,
                password: hashString(req.body.password)
              })
              try {
                const newUser = await user.save()
                res.redirect(`/`)
              } catch {
                res.render('users/signup', {
                  user: user,
                  errors: 'Error creating User'
                })
              }
        } else {
            res.json({ error: 'This email is linked to another account.' }); 
        }

    } catch(err) {
        res.json({ error: 'Connection error.' });
    }
  })

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