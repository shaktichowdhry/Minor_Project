// Contains logic for routes - CRUD controller

const Menu = require('../../models/menu')

function homeController() {
    //Using factory functions - simple fuction that returns object
    return {
        async index(req, res) {
            // res.status(200).send("Hello from server 🚀")

            // Using Async await
            const cakes = await Menu.find()
                // console.log(cakes);
            return res.render('home', { cakes: cakes })

            // another method
            // Menu.find().then(function(cakes) {
            //     console.log(cakes);
            //     return res.render('home', { cakes: cakes });
            // })
        }
    }
}

module.exports = homeController