require('dotenv').config()
const express = require("express");
const app = express();
const ejs = require('ejs');
const expressLayout = require("express-ejs-layouts");
const path = require('path');
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose')
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo')(session)
const passport = require('passport')
const Emitter = require('events')


// Database connection - make a snipped
const url = 'mongodb://localhost/sugarfield';
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifieldTopology: true, useFindAndModify: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
}).catch(err => {
    console.log('Connection failed...');
})

// event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

// session store
let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
})

// session config
app.use(session({
    // session requires cookies to work
    // for encryption
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } //cookie lifetime - 24 hrs
}))

// passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// Assets
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

// set template engine  
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')
    // routes - must be after setting template engine

// importing local modules
require('./routes/web')(app)

// listerning to the port
const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});

// Socket io
const io = require('socket.io')(server)
io.on('connection', (socket) => {
    // Join - unique rooms
    // console.log(socket.id)
    socket.on('join', (orderId) => {
        // console.log(orderId)
        socket.join(orderId) //method of socket
    })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})