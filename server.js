//require('dotenv').config();

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

  const express = require('express')
  const app = express()
  const expressLayouts = require('express-ejs-layouts')
  
  const indexRouter = require('./routes/index')
  
  app.set('view engine', 'ejs')
  app.set('views', __dirname + '/views')
  app.set('layout', 'layouts/layout')
  app.use(expressLayouts)
  app.use(express.static('public'))
  
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


  app.use('/', indexRouter)

  
  
  app.listen(process.env.PORT || 3000)




  