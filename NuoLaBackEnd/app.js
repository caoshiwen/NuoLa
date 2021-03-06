var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyparser = require('body-parser');
var session  = require('express-session');
var history = require('connect-history-api-fallback');//express vue-router history
// var ecstatic = require('ecstatic');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');
var cartRouter = require('./routes/cart');
var orderRouter = require('./routes/order');
var app = express();
// Access-Control-Allow-Origin.
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(ecstatic({ root: __dirname + '/RouLa' }));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));


// use session
app.use(session({
  secret: "nuolasecret",
  resave: false,
  saveUninitialized: true,// save initalized
  cookie: {
    maxAge: 1000*60*3, //set session time
  }
}));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);
app.use(history({
  rewrites: [
    {
      from: /^\/RuoLa\/.*$/,
      to: function(context) {
        console.log(1,context.parsedUrl.pathname)
        return context.parsedUrl.pathname;
      }
    },
    {
      from: /^\/source\/.*$/,
      to: function(context) {
        console.log(2,context.parsedUrl.pathname)
        return context.parsedUrl.pathname;
      }
    },
    {
      from: /^\/.*[js|css]$/,
      to: function(context) {
        console.log(3,context.parsedUrl.pathname)
        return '/RuoLa/'+context.parsedUrl.pathname;
      }
    },
    {
      from: /^\/.*$/,
      to: function(context) {
        console.log(4,context.parsedUrl.pathname)
        return '/RuoLa/';
      }
    },

  ]
}))
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.redirect('/NuoLa/error.html');
  res.render('error');
});

module.exports = app;
