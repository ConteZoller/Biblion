const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

// All Authors Route
router.get('/',  async (req, res) => {
  if(req.session.user) {
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
} else {
    res.sendStatus(403)
}
  
})

// New Author Route
router.get('/new', (req, res) => {
  if(req.session.user) {
  res.render('authors/new', { author: new Author() })
  } else {
    res.sendStatus(403)
  }
})

// Create Author Route
router.post('/',  async (req, res) => {
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

router.get('/:id',  async (req, res) => {
  if(req.session.user) {
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
  } else {
    res.sendStatus(403)
  }
  
})

router.get('/:id/edit',  async (req, res) => {
  if(req.session.user) {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
      } catch {
        res.redirect('/authors')
      }
  } else {
    res.sendStatus(403)
  }
  
})

router.put('/:id', async (req, res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    author.name = req.body.name
    await author.save()
    res.redirect(`/authors/${author.id}`)
  } catch {
    if (author == null) {
      res.redirect('/')
    } else {
      res.render('authors/edit', {
        author: author,
        errors: 'Error updating Author'
      })
    }
  }
})

router.delete('/:id',  async (req, res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    await author.remove()
    res.redirect('/authors')
  } catch {
    if (author == null) {
      res.redirect('/')
    } else {
      res.redirect(`/authors/${author.id}`)
    }
  }
})

module.exports = router