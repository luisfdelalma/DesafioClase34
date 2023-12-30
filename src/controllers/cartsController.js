import { cartsServices, productsServices, ticketsServices } from "../repositories/index.js";
import ticketRepository from "../repositories/tickets.repository.js";
import { ticketCode } from "../middlewares/utils.js";

export const create = async (req, res) => {
    let { CId, products } = req.body
    if (!CId) {
        req.logger.error("Falta el ID del carrito")
        res.send({ status: "Error", error: "Falta el ID del carrito" })
    } else {
        let result = await cartsServices.create(CId, products)
        res.send({ result: "success", payload: result })
    }
}

export const deleteCart = async (req, res) => {
    let CId = req.params.CId

    if (CId) {
        let result = await cartsServices.deleteCart(CId)
        res.send({ result: "success", payload: result })
    } else {
        res.send({ status: "Error", error: "No se ingresó el id del carrito a eliminar" })
    }
}

export const deleteProduct = async (req, res) => {
    let CId = req.params.cid
    let PId = req.params.PId

    if (CId && PId) {
        let result = await cartsServices.deleteProduct(CId, PId)
        res.send({ result: "success", payload: result })
    } else {
        res.send({ status: "Error", error: "No se ingresó el id del carrito a modificar o el id del producto a eliminar" })
    }
}

export const modifyCart = async (req, res) => {
    let CId = req.params.cid
    let newProduct = req.body

    if (CId && newProduct) {
        let result = await cartsServices.modifyCart(CId, newProduct)
        res.send({ result: "success", payload: result })
    } else {
        res.send({ status: "Error", error: "No se ingresó el id del carrito a modificar o los productos a modificar" })
    }
}

export const modifyProduct = async (req, res) => {
    let CId = req.params.cid
    let PId = req.params.pid
    let newQ = req.body.quantity

    if (CId && PId && newQ) {
        let result = await cartsServices.modifyProduct(CId, PId, newQ)
        res.send({ result: "success", payload: result })
    } else {
        res.send({ status: "Error", error: "Faltan datos para modificar la cantidad de producto del carrito" })
    }
}

export const getCart = async (req, res) => {
    let CId = req.params.cid

    if (CId) {
        let result = await cartsServices.getCart(CId)
        const products = result.products.toObject()
        let total = 0
        let prices = []

        for (const prod of products) {
            total = total + (prod.product.price * prod.quantity)
            let prodprice = { product: prod.product._id }
            prices.push(prodprice)
        }


        res.render("cart", { CId: result.CId, products: products, total: total, prices: prices })
    } else {
        res.send({ status: "Error", error: "No se ingresó el id del carrito a buscar" })
    }
}

export const addToCart = async (req, res) => {
    let product = req.params.pid.toString()
    let user = req.cookies["User"]
    let cart = await cartsServices.getCartByUser(user)
    if (cart) {
        let result = await cartsServices.modifyCart(cart.CId, product)
        console.log(result);
        setTimeout(() => {
            res.redirect("back")
        }, 1000)
    } else {
        const CId = parseInt(Date.now() + Math.floor(Math.random() * 1000) + 1)
        let result = await cartsServices.create(CId, product, user)
        console.log(result._id);
        setTimeout(() => {
            res.redirect("back")
        }, 1500)
    }
}

export const purchase = async (req, res) => {
    const prods = Object.entries(req.body).map(([key, value]) => {
        const [obj] = value
        return { quantity: obj.quantity, id: obj.id }
    })

    let stock = []
    for (let i = 0; i < prods.length; i++) {
        let indstock = await productsServices.searchStock(prods[i].id)
        stock.push(indstock)
    }

    let finishedPurchase = []
    let rejectedPurchase = []
    for (const prod of prods) {
        for (const inv of stock) {
            if (prod.id == inv._id) {
                if (prod.quantity < inv.stock && inv.status == true) {
                    let prodVector = { id: prod.id, purchasedQ: prod.quantity, price: inv.price }
                    finishedPurchase.push(prodVector)
                    let newStock = parseInt(inv.stock - prod.quantity)
                    let stockUpdate = await productsServices.stockUpdate(prod.id, newStock)
                } else {
                    if (prod.quantity > inv.stock) {
                        let rejected = { id: prod.id, purchaseQ: prod.quantity, reason: "inventario insuficiente" }
                        rejectedPurchase.push(rejected)
                    } else {
                        let rejected = { id: prod.id, purchaseQ: prod.quantity, reason: "Producto no disponible para venta" }
                        rejectedPurchase.push(rejected)
                    }
                }
            }
        }
    }

    let total = 0
    for (const p of finishedPurchase) {
        total = total + (p.price * parseInt(p.purchasedQ))
    }

    const purchaseCode = ticketCode()
    const cart = await cartsServices.getCart(parseInt(req.params.cid))
    const email = cart.user.toObject().email
    const purchase_datetime = Date()

    const ticket = await ticketsServices.create(purchaseCode, purchase_datetime, total, email)
    const getTicket = await ticketsServices.get(email)

    res.render("ticket", { code: getTicket.code, date: getTicket.purchase_datetime, total: getTicket.amount, client: getTicket.purchaser, purchased: finishedPurchase, rejected: rejectedPurchase })


    let finPurIds = finishedPurchase.map(p => p.id)
    console.log(finPurIds);

    let deletePurchased = await cartsServices.deleteProduct(parseInt(req.params.cid), finPurIds)

}