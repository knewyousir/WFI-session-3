# III - Server Side with ExpressJS

Today we continue to work with NPM and start looking at ExpressJS and server side development.

## Homework

* Watch a [Crash Course on Express](https://youtu.be/gnsO8-xJ8rs) and follow along in your editor
* Download the done branch of this repo, review the steps below, and get the communication between the form and _your own account_ on mLab working (see the [instructions for connecting](https://docs.mlab.com/connecting/)). 

## NODE

As an implementation of a JS engine outside the browser, Node can run JS on the server:

```sh
cd other
node script.js
```

```js
var addItems = function (num1, num2) {
  console.log( num1 + num2 )
}

addItems(1,2)
```

A simple node.js [server](https://nodejs.org/en/about/).

DEMO: Save this into `script.js` in the `other` folder and run it using `node script.js`

```js
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

## Express

```sh
npm init -y
npm i -S express
```

[Express](https://expressjs.com/en/api.html#req) is a server side framework for building web applications on Node.js. It simplifies the server creation process and allows you to use JavaScript as your server-side language.

Common web-development tasks are not directly supported by Node. If you want to add specific handling for different HTTP verbs (e.g. GET, POST, DELETE, etc.), separately handle requests at different URL paths ("routes"), serve static files, or use templates to dynamically create the response, you will need to write the code yourself or use Express.

Create `index.js` in the root folder of our project.

```js
const express = require('express');
const app = express();
const port = 9000;

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(port, function() {
  console.log(`Listening on port ${port}!`);
});
```

Run with `$ node index.js`.

CommonJS module using the keywords require and exports.

Note that `console.log` is using the terminal, _not_ the browser's console. 

Also note the [get](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) verb.

Set up an NPM start command in package.json:

```js
"scripts": {
  "start": "node index.js"
},
```

Add a second route to `index.js`. 

You will need to restart the server in order for this to run:

```js
const express = require('express');
const app = express();
const port = 9000;

// our first route
app.get('/', function (req, res) {
  res.send('Hello World!');
});

// our second route
app.get('/music', function(req, res) { 
  res.send(`
    <h1>music</h1>
    <p>Commentary on music will go here.</p>
    `);
});

app.listen(port, function() {
  console.log(`Listening on localhost port ${port}!`);
});
```

Visit [http://localhost:9000/music](http://localhost:9000/music)

Edit the second route to include a variable and restart the server:

```js
app.get('/music/:type', function(req, res) {
  let type = req.params.type;
    res.send(`
    <h1>Music</h1>
    <p>Commentary on ${type} music will go here.</p>
    `);
});
```

Restart the server and test it [http://localhost:9000/music/baroque](http://localhost:9000/music/baroque).

## Nodemon

We need to restart the server whenever we make a change to `index.js`. Let’s streamline it by installing the nodemon NPM package.

`$ npm i -S nodemon`

To use nodemon we simply call it (instead of node) in the terminal with the name of our file. Edit the start script in `package.json`:

```js
"scripts": {
  "start": "nodemon index.js"
},
```

Nodemon will watch for changes and restart the server.

Edit the second route and reload:

```js
app.get('/music/:type', function(req, res) {
  const reverse = [...req.params.type].reverse().join(''); // NEW
  let type = reverse;
    res.send(`
    <h1>Music</h1>
    <p>Commentary on ${type} music will go here.</p>
    `);
});
```

### Node File System

No NPM install required.

File system require `const fs = require('fs')`

Add

```js
const log = console.log;
const articles = [];

var content = fs.readFile('./other/json/travel.json', { encoding: 'utf8' }, function (err, data) {
  if (err) throw err
  JSON.parse(data).forEach(function (article) {
    articles.push(article.title);
  })
  log(articles)
})
```

Edit the first route:

```js
// our first route
app.get('/', function (req, res) {
  var buffer = ''
  articles.forEach(function (article) {
    buffer += `<a href="/${article}">${article}</a> <br>`
  })
  res.send(buffer);
});
```


Create a third route:

```js
// our third route
app.get('/:article', function (req, res) {
  const article = req.params.article
  var buffer = ''
  buffer += article + '<br>'
  buffer += '<a href="/">Back</a>'
  res.send(buffer);
});
```

Routes - use regular expressions:

```js
app.get(/Oslo.*/, function (req, res){
  console.log('OSLO')
  next()
})
```

Route ordering is important. When `res.send` runs, no other routes will register. 

Insert the code above before the second route and test.

Passing info via the response object:

```js
app.get(/Oslo.*/, function (req, res, next){
  const location = 'Norway';
  res.location = location;
  next()
})
```

Include it in the output:

```js
// our third route
app.get('/:article', function (req, res) {
  log(res.location)
  const article = req.params.article
  var buffer = ''
  if (res.location){
    buffer += res.location + '<br>'
  }
  buffer += article + '<br>'
  buffer += '<a href="/">Back</a>'
  res.send(buffer);
});
```

## Express Middleware

[Middleware](http://expressjs.com/en/resources/middleware.html) is used in Express apps to simplify common web development tasks like working with cookies, sessions, user authentication, accessing and sending JSON, logging, etc.

DEMO: We will eventually be using [static](https://expressjs.com/en/starter/static-files.html) middleware (the only middleware _built in_ to Express) to serve files in our exercise.

Add to `index.js` (above the app.get... line):

```js
app.use(express.static('app'));
```

You should be able to see the site in the app folder from session 2.

<!-- Comment out `app.use(express.static('app'))` - we'll make use of this later. -->

## CRUD

CRUD is an acronym for Create, Read, Update and Delete. It is a set of operations we get servers to execute (using the http verbs POST, GET, PUT and DELETE respectively). This is what [each operation does](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods):

* Read (GET) - Retrieve something, requests a representation of the specified resource
* Create (POST) - Make something, a message for a bulletin board, newsgroup, mailing list, or comment thread; a block of data that is the result of submitting a web form to a data-handling process
* Update (PUT) - Alter an existing item, if the URL refers to an already existing resource, it is modified; if not, then the server can create the resource with that URL
* Delete (DELETE)- deletes the specified resource.

As we have seen, in Express, we handle a GET request with the get method:

`app.get('/', (req, res) => res.send('Hello World!'))`

The first argument, `/,` is the path of the GET request (anything that comes after your domain name). For localhost:3000, the browser is actually looking for localhost:3000/. The path argument in this case is /.

The second argument, e.g. `(req, res) => res.send('Hello World!')`, is a callback function that tells the server what to do when the path is matched. It takes two arguments, a request object and a response object (req, res).

Use `res.sendFile`, method that’s provided by the res object, to serve an index.html page back to the browser.

Edit index.html in the app folder:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Articles</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="./css/styles.css">
</head>
<body>
  <header>
    <h1>Now on the app store!</h1>
  </header>
</body>
</html>
```

```js
app.get('/', (req, res) => {
  // console.log(__dirname)
  res.sendFile(__dirname + '/app/index.html');
});
```

(`__dirname` is a global variable for the directory that contains index.js.)

You should be able to see the HTML file in the browser at the specified port number.

## Proxy browser-sync

`npm i browser-sync --save-dev`

Works on port 3000 (the browser-sync port)

```js
"scripts": {
  "start": "nodemon index.js & browser-sync start --proxy localhost:9000 --files 'app'"
},
```

## CRUD - CREATE

The CREATE operation is performed only by the browser if a POST request is sent to the server. This POST request can triggered either with JavaScript or through a `<form>` element.

Add the following to index.html

```html
<form action="/entries" method="POST">
  <input type="text" placeholder="Story Title" name="title">
  <input type="text" placeholder="Enter 1, 2 or 3" name="multimedia">
  <textarea type="text" placeholder="Story Abstract" name="abstract"></textarea>
  <button type="submit">Submit</button>
</form>
```

Our form requires:

1. an action attribute
1. a method attribute
1. and name attributes on all `<input>` elements within the form

The action attribute tells the browser where to navigate to in our Express app.

The method attribute tells the browser what to request to send. In this case, it’s a POST request.

```html
<style>
  input, textarea {
    font-size: 1rem;
    display: block;
    margin: 1rem;
    width: 70%;
  }
  button {
    color: #fff;
    font-size: 1rem;
    padding: 0.5rem;
    background: #007eb6;
  }
</style>
```

On our server, we can handle this POST request with the post method that Express provides. It takes the same arguments as the GET method:

```js
app.post('/entries', (req, res) => {
  console.log('Hello');
  res.redirect('/');
});
```

Click the form button. You should see 'Hello' in the terminal.

Express doesn’t handle reading data from the `<form>` element on it’s own. We have to add a middleware package called body-parser to gain this functionality.

`$ npm i body-parser --save`

Make the following additions to `app.js`:

```js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 9000;
app.use(bodyParser.urlencoded({ extended: true }));
```

The urlencoded method within body-parser tells body-parser to extract data from the `<form>` element and add them to the body property in the request object.

Now, when you test your form, you should be able to see everything in the form field within the req.body object. Try doing a console.log:

```js
app.post('/entries', (req, res) => {
  console.log(req.body);
  res.redirect('/');
});
```

The object `{ label: '', header: '', content: '' }` is packaged by the body parser and sent to the server as part of the request body.

## Database - MongoDB

Express apps can use any database supported by Node including PostgreSQL, MySQL, MongoDB, etc.

We first have to install the [driver for MongoDB](http://mongodb.github.io/node-mongodb-native/) using npm.

`$ npm install mongodb@2.2.5 --save`

or

`$ npm install mongodb --save`

Note: this is not the MongoDB database, just the driver needed to work with it. 

Why the version number? Most tutorials were written using a version of the Mongo driver prior to version 3 and will not work properly with the current version. 

We will use the newest version.

Once installed, we can connect to MongoDB through the MongoClient‘s connect method.

e.g.:

```js
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('<<link-to-mongodb>>', (err, database) => {
  // ... start the server
});
```

We need to get the correct link to our database.

We'll use a service - [MongoLab](https://mlab.com).

Create a free account with MongoLab. Once you’re done, create a new MongoDB database and set the plan to sandbox (free) and call it `bcl`.

Once you’re done creating the deployment, click into it and create a database user and database password.

![user](other/mlab-user.png)

![user](other/mlab-user2.jpg)

Remember these because you’re going to use it to connect the database you’ve just created.

Finally, grab the MongoDB url and add it to your MongoClient.connect method. Make sure you use your database user and password, e.g.:

`MongoClient.connect('mongodb://dannyboynyc:dd2345@ds139969.mlab.com:39969/bcl', (err, database) => {...}`

We want to start our servers only when the database is connected so let’s move `app.listen` into the connect method. We’re also going to create a db variable to allow us to use the database when we handle requests from the browser.

Make sure this has been added to you variable declarations:

```js
const MongoClient = require('mongodb').MongoClient;
```

Let's wrap our database connection around the `app.listen` method:

```js
MongoClient.connect('mongodb://dannyboynyc:dd2345@ds139969.mlab.com:39969/bcl', (err, database) => {
  if (err) return console.log(err);
  db = database;
  app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });
});
```

Kill the deprecation notice with:

```js
MongoClient.connect('mongodb://dannyboynyc:dd2345@ds139969.mlab.com:39969/bcl', { useNewUrlParser: true }, (err, database) => {
  if (err) return console.log(err);
  db = database;
  app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });
});
```

Check for any errors.

Now, let’s create a collection - a named location to store data - to store content for our application.

We can create the collection by using the string `entries` while calling MongoDB’s `db.collection()` method. Since a collection is created if it doesn't already exist we can save our first entry into the database while using the `save` method.

Also, once we’re done saving, we have to redirect the user somewhere (or they’ll be stuck waiting for our server to go to `/entries` which doesn't exist except as a post route).

In this case, we’re going to redirect them back to `/`:

```js
app.post('/entries', (req, res) => {
  db.collection('entries').save(req.body, (err, result) => {
    if (err) return console.log(err);
    console.log('saved to database');
    res.redirect('/');
  });
});
```

If you see another deprication error try:

```js
app.post('/entries', (req, res) => {
  db.collection('entries').insertOne(req.body, (err, result) => {
    if (err) return console.log(err);
    console.log('saved to database');
    res.redirect('/');
  });
});
```

Now enter something into the form, note the error.

Update the call to use the new `client` :

```js
MongoClient.connect(
  'mongodb://dannyboynyc:dd2345@ds139969.mlab.com:39969/bcl', { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log(err);
  db = client.db('bcl');
  app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });
});
```

And you’ll be able to see an entry in your MongoDB collection.

### Showing entries to users

We will do two things to show the entries stored in mLab to our users.

1. Get the entries from MongoLab in our base route
2. Use some form of dynamic html (a template engine) to display the entries

We can get the entries from MongoLab by using the find method available in the collection method. No parameters in the find() method gives you the same result as SELECT * in MySQL.:

```js
app.get('/', (req, res) => {
  const cursor = db.collection('entries').find();
  console.log(cursor);
  res.sendFile(__dirname + '/index.html');
});
```

The find method returns a Mongo Object that probably doesn’t make much sense when you `console.log` it out.

This cursor object contains all entries from our database. It also contains a bunch of other properties and methods that allow us to work with data easily. One such method is the `toArray` method.

The `toArray` method takes in a callback function that allows us to do stuff with entries we retrieved from MongoLab. Let’s try doing a `console.log()` for the results and see what we get:

```js
app.get('/', (req, res) => {
  db
    .collection('entries')
    .find()
    .toArray((results) => {
      console.log(results);
      res.sendFile(__dirname + '/index.html');
    });
});
```

Refresh the page and see an array of entries in the terminal.

Let's generate HTML that displays all our entries.

## Template Engines

[Template engines](http://expressjs.com/en/guide/using-template-engines.html)

We can’t serve our index.html file and expect entries to magically appear because there’s no way to add dynamic content to a plain HTML file. What we can do instead, is to use template engines to help us out. Some popular template engines include jade/pug, Embedded JavaScript (EJS) and Handlebars.

For today, we’re going to start with Embedded JavaScript as our template engine.

We can use EJS by first installing it, then setting the view engine in Express.

`npm install ejs --save`

and in `index.js`:

```js
app.set('views', './views')
app.set('view engine', 'ejs')
```

Let’s first create an `index.ejs` file within a views folder so we can start populating data.

Make a `views` folder on the top level of our project and create `index.ejs` inside it.

```sh
mkdir views
touch views/index.ejs
```

Copy the contents of `index.html` into `index.ejs` and refresh. 

Finally, we have to render `index.ejs` when handling the GET request. Now that we have a dynamic asset we need to call `res.render` instead of `res.send`:

```js
app.get('/', (req, res) => {
  db
    .collection('entries')
    .find()
    .toArray((err, result) => {
      if (err) return console.log(err);
      res.render('index.ejs', { entries: result });
    });
});
```

Since we have already set the views and view engine we can omit the file extension:

```js
res.render('index', { entries: result });
```

In EJS, you can write JavaScript within `<%` and `%>` tags and output JavaScript as strings using the `<%=` and `%>` tags.

Add the following above the form:

```js
<% for(let i=0; i<entries.length; i++) { %>
  <div class="entry">
      <h2>
        <a href="<%= entries[i].title %>"><%= entries[i].title %></a>
      </h2>
  </div>
<% } %>
```

Now, refresh your browser and you should be able to see all entries.

<!-- ```js
app.get('/:entry', (req, res) => {
  const article = req.params.entry
  res.send(article)
})
``` -->

### Pug

[Jade](http://jade-lang.com/) (formerly Jade) is another poopular templating language.

`npm i pug`

Save this as `index.pug` into the views folder:

```jade
doctype html
html(lang="en")
  head
    title= "Pug"
  body
    h1 Jade!
    ul
      each entry in entries
        li
          a(href='/' + entry.title)= entry.title
```

And set the view engine:

```js
app.set('views', './views')
app.set('view engine', 'pug')
```

### Handlebars

Some templating laguages do not have native Express support. [Handlebars](https://handlebarsjs.com/) is an example.

`npm i handlebars consolidate`

Consolidate provides shims for templating languages not supported by Express natively.

`const engines = require('consolidate');`

```js
app.engine('hbs', engines.handlebars)
app.set('views', './views')
app.set('view engine', 'hbs')
```

Add the following into the existing ejs file and save as `index.hbs`:

```html
<ul>
  {{#each entries as |entry|}}
  <li><a href="/{{entry.title}}">{{entry.title}}</a></li>
  {{/each}}
</ul>
```

Note, we can still use the other engines by adding the suffix:

`res.render('index.ejs', { entries: result });`

But the default will be handlebars.

### Images

Make sure `app.use(express.static('app'))` is enabled.

```html
<body>

  {{#each entries as |entry|}}
  <div class="entry">
  <img src="/img/{{entry.multimedia}}.jpg" />
  <a href="/{{entry.title}}">{{entry.title}}</a>
  <p>{{entry.abstract}}</p>
  </div>
  {{/each}}

  <h3>Add a Story</h3>
  <form action="/entries" method="POST">
    <input type="text" placeholder="Story Title" name="title">
    <input type="text" placeholder="Enter 1, 2 or 3" name="multimedia">
    <textarea type="text" placeholder="Story Abstract" name="abstract"></textarea>
    <button type="submit">Submit</button>
  </form>
  
</body>
```

Note that we omit the `app` path:

`<img src="img/1.jpg" />`

We can create a custom path:

```js
app.use('/storyimages/', express.static('app/img'));
```

Which means - anytime you get a request for storyimages look in app/img.

In `index.hbs`:

`<img src="/storyimages/{{entry.multimedia}}.jpg" />`

## A Story Page

Edit `index.ejs` to use the unique id in the db as a link:

```js
{{#each entries as |entry|}}
<div class="entry">
<img src="/img/{{entry.multimedia}}.jpg" />
<a href="/{{entry._id}}">{{entry.title}}</a>
<p>{{entry._id}}</p>
</div>
{{/each}}
```

Save a new page to views as `story.hbs` - leave out the form:

```html
<div class="entry">
  <img src="/storyimages/{{entry.multimedia}}.jpg" />
  <h3>{{entry.title}}</h3>
  <p>{{entry.abstract}}</p>
</div>
```

Get only the first entry

```js
app.get('/:id', (req, res) => {
  const entry = req.params.id
  db.collection('entries')
  .findOne({}, function(err, result){
    if (err) return console.log(err);
    console.log(result.abstract);
    res.send(result.abstract)
  })
})
```

Here we are using `res.send` so the template is not used.

Send it to the new template:

```js
app.get('/:id', (req, res) => {
  const entry = req.params.id
  db.collection('entries')
  .findOne({}, function(err, result){
    if (err) return console.log(err);
    res.render('story', {entry: result})
  })
})
```

Note that no matter which story you click on, it always returns the first.

Demo only: use a query to get a single result:

```js
app.get('/:id', (req, res) => {

  const id = req.params.id;
  const query = { title: 'Test' }; // use an existing title
  log(query)

  db.collection('entries')
  .find(query)
  .toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
  })

})
```

Note the console - because this returns an array you would still need to run a forEach in the template.

Run findOne with a query and ObjectID.

Add this to the variables in `index.js`:

`const ObjectId = require('mongodb').ObjectID;`

```js
app.get('/:id', (req, res) => {
  const id = req.params.id;
  db.collection('entries')
  .findOne({ '_id' : new ObjectId(id) }, function(err, result){
    log(result)
    if (err) return console.log(err);
    res.render('story', {entry: result})
  })
})
```

One last get route:

```js
app.get('*.json', (req, res) => {
  res.download('./other/json/travel.json', 'virus.exe')
})
```

## SASS

`npm i node-sass --save-dev`

```js
"start": "nodemon index.js & browser-sync start --proxy localhost:9000 --files 'app' & node-sass --watch 'scss'  --output 'app/css/' "
```

or in VSCode:

```js
{
  "liveSassCompile.settings.formats": [
      {
          "savePath": "/app/css",
          "format": "expanded"
      }
  ],
  "liveSassCompile.settings.excludeList": [
      "**/node_modules/**",
      ".vscode/**",
      "**/other/**"
  ]
}
```


## Notes

```js
app.get('*.json', (req, res) => {
  res.download('./other/json/travel.json', 'virus.exe')
})
```

```js
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
```



