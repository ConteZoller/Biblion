const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const auth = require("../middleware/auth")

router.get('/', auth, async (req, res) => {
  let books
  try {
    //mostra solo gli ultimi 6 libri aggiunti
    books = await Book.find().sort({ createdAt: 'desc' }).limit(6).exec()
  } catch {
    books = []
  }
  res.render('index', auth,{ books: books })
})

module.exports = router