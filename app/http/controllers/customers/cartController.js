function cartController() {
    return {
        index(req, res) {
            return res.render('customers/cart')
        },
        update(req, res) {
            // Similar struture wiil be followed
            // let cart = {
            //     items: {
            //         cakeId: { item: cakeObject, qty: 0 },
            //     },
            //     totalQty: 0,
            //     totalPrice: 0
            // }

            // for first time creating cart and adding basic object structure
            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }
            let cart = req.session.cart
            console.log(req.body)
                // Check if item does not exist in cart
            if (!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            } else {
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.talPrice + req.body.price
            }
            return res.json({ totalQty: req.session.cart.totalQty })
        }
    }
}

module.exports = cartController