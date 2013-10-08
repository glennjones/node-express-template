'use strict';

var express         = require('express'),
    http            = require('http'),
    fs              = require('fs'),
    path            = require('path'),
    handlers        = require('./lib/handlers.js'),
    pack            = require('./package.json');


var app = express(),
    requires = {},
    helpersDir = 'templates/helpers',
    partialsDir = 'templates/withPartials',
    host = 'http://localhost:3000',
    port = 3000,
    filenames,
    template;


// changes for production environment
if(process.env.NODE_ENV && process.env.NODE_ENV === 'production'){
  host = 'http://example.com';
  port = process.env.PORT;
}


// reads templates for app.engine
function read(filepath, options, fn) {
  // read
  fs.readFile(filepath, 'utf8', function(err, str){
    if (err) return fn(err);
    fn(null, str);
  });
}


// inits template engine 
var handlebars = function(filepath, options, fn) {
  var engine = requires.handlebars || (requires.handlebars = require('handlebars'));

  // add handelbars helper
  filenames = fs.readdirSync(helpersDir);
  filenames.forEach(function (filename) {
    engine.registerHelper(filename.replace('.js',''), require('./' + helpersDir + '/' + filename));
  });

  // add partial template
  filenames = fs.readdirSync(partialsDir);
  filenames.forEach(function (filename) {
    var template = fs.readFileSync(path.join(__dirname, partialsDir + '/' + filename), 'utf8');
    engine.registerPartial(filename.replace('.html',''), template);
  });

  read(filepath, options, function(err, str){
    if (err) return fn(err);
    try {
      options.filename = filepath;
      var tmpl = engine.compile(str, options);
      fn(null, tmpl(options));
    } catch (err) {
      fn(err);
    }
  });
} 




app.configure(function(){
  app.set('port', port);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(express.methodOverride());

  // allows CORS (cross-origin resource sharing)
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

  app.use(app.router);

  // set the static path
  app.use(express.static(path.join(__dirname, 'templates')));

  // 404 error handle
  app.use(notFound);

  // 500 error handle
  app.use(errorHandler);

  // assign the engine to .html files and handlebars
  app.engine('html', handlebars);

  // set .html as the default extension 
  app.set('view engine', 'html');
  app.set('views', __dirname + '/templates');
});



// simple not found handler
function notFound(req, res, next) {
    var fullURL = req.protocol + "://" + req.get('host') + req.url;
    res.status(404).render('error', {
        title: 'Sorry, could not find the page you requested',
        body: '',
        url: fullURL
    });
}


// simple error handler
function errorHandler(err, req, res, next) {
    var fullURL = req.protocol + "://" + req.get('host') + req.url;
    res.status(500).render('error', { 
        title: 'Sorry, something went wrong :(',
        body: err,
        url: fullURL
    });
}


// add routes and links to handlers
app.get('/', handlers.index);
app.get('/add', handlers.add);
app.post('/add', handlers.add);
app.get('/subtract', handlers.subtract);
app.post('/subtract', handlers.subtract);
app.get('/divide', handlers.divide);
app.post('/divide', handlers.divide);
app.get('/multiple', handlers.multiple);
app.post('/multiple', handlers.multiple);



// start server
var server = http.createServer(app).listen( port, function(){
  console.log('App name:', pack.name);
  console.log('App version:', pack.version); 
  console.log("Server started listening on port " + port );
});


