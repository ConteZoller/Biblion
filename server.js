//require('dotenv').config();

  //session
  'use strict';
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

  const express = require('express')
  const app = express()
  const expressLayouts = require('express-ejs-layouts')
  const bodyParser = require('body-parser')
  
  const indexRouter = require('./routes/index')
  const authorRouter = require('./routes/authors')
  const bookRouter = require('./routes/books')

  //session

  const helmet = require('helmet');
  const cookieSession = require('cookie-session');
  const { sessionName, sessionKeys } = require('./config');
 
  
  app.disable('x-powered-by');
  //

  app.set('view engine', 'ejs')
  app.set('views', __dirname + '/views')
  app.set('layout', 'layouts/layout')
  app.use(expressLayouts)
  app.use(express.static('public'))
  //da vedere se eliminare causa conflitto
  //app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

  
  const mongoose = require('mongoose')
  mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true})
  const db = mongoose.connection
  db.on('error', error => console.error(error))
  db.once('open', () => console.log('Connected to Mongoose'))
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

//session
  //app.use('/public', express.static(path.join(__dirname, 'public')));
  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieSession({
      name: sessionName,
      keys: sessionKeys
  }));

  app.use('/', indexRouter)  
  app.use('/authors', authorRouter)
  app.use('/books', bookRouter)


  
  
  app.listen(process.env.PORT || 3000)




  