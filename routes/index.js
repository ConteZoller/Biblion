const express = require('express')
const router = express.Router()
const Book = require('../models/book')

router.get('/', async (req, res) => {
  let books
  try {
    //mostra solo gli ultimi 6 libri aggiunti
    books = await Book.find().sort({ createdAt: 'desc' }).limit(6).exec()
  } catch {
    books = []
  }
  res.render('index', { books: books })
})

module.exports = router