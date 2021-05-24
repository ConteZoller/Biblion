const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const auth = require("../middleware/auth")

router.get('/', async (req, res) => {
  
  res.render('users', { layout : 'layouts/login.ejs' })
})

router.get('/', async (req, res) => {
  let books
  try {
    books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch {
    books = []
  }
  res.render('index', { books: books })
})



module.exports = router