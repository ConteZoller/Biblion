'use strict';

const express = require('express');
const router = express.Router();
const {db, hashString} = require('../utils');
const { dbUrl, dbName, dbCollection } = require('../config');

router.get('/', (req, res, next) => {

    res.render('index', { user:  req.session.user ? req.session.user : null });
});


/*
router.get('/', async (req, res, next) => {
    let books
try {
    books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec()
} catch {
    books = []
}

    res.render('index', { user:  req.session.user ? req.session.user : null }, { books: books } );
});
*/

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