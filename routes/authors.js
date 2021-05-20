const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')
const auth = require("../middleware/auth")

// All Authors Route
if(auth){
router.get('/', auth, async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const authors = await Author.find(searchOptions)
    res.render('authors/index', {
      authors: authors,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Author Route
router.get('/new', auth, (req, res) => {
  res.render('authors/new', { author: new Author() })
})

// Create Author Route
router.post('/', auth, async (req, res) => {
  const author = new Author({
    name: req.body.name
  })
  try {
    const newAuthor = await author.save()
    //res.redirect(`authors/${newAuthor.id}`)
    res.redirect(`authors`)
  } catch {
    res.render('authors/new', {
      author: author,
      errors: 'Error creating Author'
    })
  }
})

router.get('/:id', auth, async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    const books = await Book.find({ author: author.id }).limit(6).exec()
    res.render('authors/show', {
      author: author,
      booksByAuthor: books
    })
  } catch {
    res.redirect('/')
  }
})

router.get('/:id/edit', auth, async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    res.render('authors/edit', auth, { author: author })
  } catch {
    res.redirect('/authors', auth)
  }
})

router.put('/:id', auth, async (req, res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    author.name = req.body.name
    await author.save()
    res.redirect(`/authors/${author.id}`, auth)
  } catch {
    if (author == null) {
      res.redirect('/')
    } else {
      res.render('authors/edit', auth, {
        author: author,
        errors: 'Error updating Author'
      })
    }
  }
})

router.delete('/:id', auth, async (req, res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    await author.remove()
    res.redirect('/authors', auth)
  } catch {
    if (author == null) {
      res.redirect('/')
    } else {
      res.redirect(`/authors/${author.id}`, auth)
    }
  }
})
}
module.exports = router