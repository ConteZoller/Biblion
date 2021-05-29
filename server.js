

  //session
  'use strict';
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

  ////////////////////////////  Caricamento componenti  //////////////////

  const bodyParser = require('body-parser')
  const helmet = require('helmet');
  const cookieSession = require('cookie-session');
  const { sessionName, sessionKeys } = require('./config');

  const express = require('express');
  const expressLayouts = require('express-ejs-layouts');

  ///////////////////////////////////////////////////////////////////////

  ////////////////////////////  Impostazione MongoDB  ///////////////////

  const mongoose = require('mongoose')
  mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true})
  const db = mongoose.connection
  db.on('error', error => console.error(error))
  db.once('open', () => console.log('Connected to Mongoose'))

  ///////////////////////////////////////////////////////////////////////

  //TODO: Cancella o no?
  /*
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://dbUser:3vu$Sk5EEMLQyHb@biblion.kgmsq.mongodb.net/BiblionDB?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
    });
  */

  ////////////////////////////  Impostazione routes  ////////////////////

  const indexRouter = require('./routes/index')
  const authorRouter = require('./routes/authors')
  const bookRouter = require('./routes/books')

  ///////////////////////////////////////////////////////////////////////

  //////////////////////////// Impostazione server //////////////////////

  
  var app = express();

  app.set('view engine', 'ejs')
  app.use(expressLayouts)
  app.disable('x-powered-by');
  app.set('views', __dirname + '/views')
  app.set('layout', 'layouts/layout')
  
  app.use(express.static('public'))

  //TODO Cancella o no?
  /*
  da vedere se eliminare causa conflitto
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
  app.use('/public', express.static(path.join(__dirname, 'public')));  
  */

  app.use(helmet());
  //app.use(bodyParser.urlencoded({ extended: true })); 
  app.use(express.urlencoded())
  app.use(cookieSession({
      name: sessionName,
      keys: sessionKeys
  }));

  app.use('/', indexRouter)  
  app.use('/authors', authorRouter)
  app.use('/books', bookRouter)


  
  
  app.listen(process.env.PORT || 3000)


  ///////////////////////////////////////////////////////////////////////





  