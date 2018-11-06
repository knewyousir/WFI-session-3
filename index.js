const express = require('express');
const fs = require('fs');
const app = express();
const port = 9000;
const log = console.log;
const articles = [];

var content = fs.readFile('./other/json/travel.json', { encoding: 'utf8' }, function (err, data) {
  if (err) throw err
  JSON.parse(data).forEach(function (article) {
    var story = {}
    story.title = article.title;
    story.abstract = article.abstract;
    story.image = Math.floor(Math.random() * 3 +1)
    articles.push(story);
  })
  log(articles)
})

// our first route
app.get('/', function (req, res) {
  var buffer = ''
  articles.forEach(function (article) {
    buffer += `<a href="/${article.title}">${article.title}</a> <br>`
  })
  res.send(buffer);
});

app.get(/Oslo.*/, function (req, res, next){
  console.log('OSLO');
  const loc = 'Norway';
  res.loc = loc;
  next();
})

// our second route
app.get('/music/:type', function(req, res) {
    const reverse = [...req.params.type].reverse().join(''); // NEW
    let type = reverse;
      res.send(`
      <h1>Music</h1>
      <p>Commentary on ${type} music will go here.</p>
      `);
  });

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

app.listen(port, function() {
  console.log(`Listening on port ${port}!`);
});