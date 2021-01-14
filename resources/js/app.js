import axios from 'axios';
import Noty from 'noty';
import { initAdmin } from './admin'
import moment from 'moment'


let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')

function updateCart(cake) {
    // Ajax call - axios
    axios.post('/update-cart', cake).then(res => {
        // console.log(res)
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000,
            progressBar: false,
            text: 'Item added to cart'
        }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            progressBar: false,
            text: 'Something went wrong'
        }).show();
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let cake = JSON.parse(btn.dataset.cake)
            // console.log(cake)
        updateCart(cake)
    })
})


// REmovinging alert message in order page
const alertMsg = document.querySelector('#success-alert')
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 5000)
}

// initAdmin()

// Change order status in singleorder status page
let statuses = document.querySelectorAll('.status_line')
    // console.log(statuses)
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
    // console.log(order)
let time = document.createElement('small')


function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status
        if (stepCompleted) {
            status.classList.add('step-completed')
        }
        if (dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updateAt).format('hh:mm A')
            status.appendChild(time)
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
        }
    })
}

updateStatus(order);


// Socket
let socket = io()

//Join
if (order) {
    socket.emit('join', `order_${order._id}`)
}

let adminAreaPath = window.location.pathname
    // console.log(adminAreaPath)
if (adminAreaPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = {...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
        // console.log(data)
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        progressBar: false,
        text: 'Order Updated'
    }).show();
})

// smooth scroll
const scroll = new SmoothScroll(' a[href*="#"]', {
    speed: 800
})