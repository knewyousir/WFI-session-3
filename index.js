const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const engines = require('consolidate');
const fs = require('fs');

const app = express();
const port = 9000;
const log = console.log;
const articles = [];

app.use(express.static('app'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/storyimages/', express.static('app/img'));

// Using ejs...
// app.set('views', './views')
// app.set('view engine', 'ejs')


// Using pug...
// app.set('views', './views')
// app.set('view engine', 'pug')

// Using handlebars
app.engine('hbs', engines.handlebars)
app.set('views', './views')
app.set('view engine', 'hbs')

// our first route
// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/views/index.html');
// });

app.get('*.json', (req, res) => {
  res.download('./other/json/travel.json', 'virus.exe')
})

app.get('/', (req, res) => {
  db
    .collection('entries')
    .find()
    .toArray((err, result) => {
      if (err) return console.log(err);
      // res.render('index.ejs', { entries: result });
      res.render('index', { entries: result });
    });
});

app.get('/:id', (req, res) => {
  const id = req.params.id;
  db.collection('entries')
  .findOne({ '_id' : new ObjectId(id) }, (err, result) => {
    log(result)
    if (err) return console.log(err);
    res.render('story', {entry: result})
  })
})

app.post('/entries', (req, res) => {
    db.collection('entries').insertOne(req.body, (err, result) => {
      if (err) return log(err);
      log('saved to database');
      res.redirect('/');
    })
})

// our third route
app.get('/:article', function (req, res) {
  const article = req.params.article
  var buffer = '';
  if (res.loc){
    buffer += res.loc + ' <br/>';
  }
  buffer += article + '<br>'
  buffer += '<a href="/">Back</a>'
  res.send(buffer);
});

MongoClient.connect(
  'mongodb://dannyboynyc:dd2345@ds139969.mlab.com:39969/bcl', { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log(err);
  db = client.db('bcl');
  app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });
});