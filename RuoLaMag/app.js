const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyparser = require('body-parser');
const session  = require('express-session');
const history = require('connect-history-api-fallback');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
//跨域
// Access-Control-Allow-Origin.
app.all('*', function(req, res, next) {
  res.set("Access-Control-Allow-Origin", "http://localhost:8081");
  res.set('Access-Control-Allow-Credentials', true); 
  res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.set("Access-Control-Allow-Methods","POST, GET");
  res.set("X-Powered-By",' 3.2.1');
  res.set("Content-Type", "application/json;charset=utf-8");
  next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
// use session
app.use(session({
  secret: "nuolasecret",
  resave: false,
  saveUninitialized: true,// save initalized
  cookie: {
    maxAge: 1000*3600*1, //set session time
  }
}));



// //这句代码需要在express.static上面
app.use('/', indexRouter);
app.use('/service/users', usersRouter);
app.use(history({
  rewrites: [
    {
      from: /^\/RuoLa\/.*$/,
      to: function(context) {
        return context.parsedUrl.pathname;
      }
    },
    {
      from: /^\/.*[js|css]$/,
      to: function(context) {
        return '/RuoLa/'+context.parsedUrl.pathname;
      }
    },
    {
      from: /^\/.*$/,
      to: function(context) {
        return '/RuoLa/';
      }
    },

  ]
}));
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
  res.render('error');
});

module.exports = app;
