const express = require("express");
const app = express();
const ejs = require('ejs');
const expressLayout = require("express-ejs-layouts");
const path = require('path');
const PORT = process.env.PORT || 3000


// Assets
app.use(express.static('public'))

// set template engine  
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

// routes - must be after setting template engine
app.get('/', (req, res) => {
    // res.status(200).send("Hello from server 🚀")
    res.render('home');
})

app.get('/cart', (req, res) => {
    res.render('customers/cart')
})

app.get('/login', (req, res) => {
    res.render('auth/login')
})

app.get('/register', (req, res) => {
    res.render('auth/register')
})

// listerning to the port
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});