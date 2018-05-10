require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const cors         = require('cors');
const session    = require("express-session");
const MongoStore = require('connect-mongo')(session);
const passportSetup  = require('./passport/setup');
    
mongoose.Promise = Promise;
mongoose
  .connect(process.env.database_url, {useMongoClient: true})
  .then(() => {
    console.log('CHAMPIONS IN THE ARENA IS RUNING :)')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// might be important to be before session (?)
app.use(cors({
  credentials: true,
  origin: ['http://localhost:4200']
}));

// Enable authentication using session + passport
app.use(session({
  secret: 'irongenerator',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore( { mongooseConnection: mongoose.connection })
}))

// require('./passport')(app);
passportSetup(app);
    

const authRouter = require('./routes/auth');
app.use('/api', authRouter);

const eventRouter = require('./routes/event-api-router');
app.use('/api', eventRouter);

const adminsRouter = require('./routes/admins-api-router');
app.use('/api', adminsRouter);

module.exports = app;

// Send Angular's HTML for all other routes
app.use((req, res, next) => {
  res.sendFiles(__dirname + 'public/index.html');
});
