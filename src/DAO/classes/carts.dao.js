import cartModel from "../models/cart.model.js";
import { ObjectId } from "mongodb";

export default class carts {

    create = async (DTOcart) => {
        try {
            const cart = await cartModel.findOne({ CId: DTOcart.CId })
            if (cart) {
                console.log("El ID del carrito ingresado ya existe");
                return null
            } else {
                let result = await cartModel.create({ CId: DTOcart.CId, products: [{ product: DTOcart.products }], user: DTOcart.user })
                return result
            }
        } catch (error) {
            console.log("Error: " + error);
            return null
        }
    }

    deleteCart = async (CId) => {
        try {

            const cart = cartModel.findOne({ CId: CId })
            if (cart) {
                let result = await cartModel.deleteOne({ CId: CId })
                return result
            } else {
                console.log("El ID del carrito ingresado no existe");
                return null
            }

        } catch (error) {
            console.log("Error: " + error);
            return null
        }
    }

    deleteProduct = async (CId, PId) => {
        try {
            const cart = await cartModel.findOne({ CId: CId })

            if (cart) {
                let products = cart.products

                for (const prod of PId) {
                    let productIndex = products.findIndex((productItem) => productItem.product._id == prod)
                    if (productIndex !== -1) {

                        let deleteProd = products.splice(productIndex, 1)
                        console.log("Producto eliminado: " + prod);
                    } else {
                        console.log("El carrito ingresado no existe");
                        return null
                    }
                }
                const updateCart = await cartModel.updateOne({ CId: CId }, { products: products })
                console.log(cart);
            }
        } catch (error) {
            console.log("Error: " + error);
            return null
        }
    }


    modifyCart = async (CId, newProd) => {
        try {
            const cart = await cartModel.findOne({ CId: CId })
            const newProduct = { product: newProd }

            if (cart) {
                let ids = []
                cart.products.forEach(el => {
                    ids.push(el.product._id.toString())
                });

                if (ids.includes(newProd)) {
                    console.log("Ya está el producto en el carrito");
                    let i = ids.findIndex(el => el == newProd)
                    let newQ = cart.products[i].quantity + 1
                    let result = await cartModel.findOneAndUpdate({ CId: CId }, { $set: { [`products.${i}.quantity`]: newQ } }, { new: true })
                    return result
                } else {
                    console.log("El producto aún no está en el carrito");
                    let result = await cartModel.findOneAndUpdate({ CId: CId }, { $push: { products: newProduct } }, { new: true })
                    return result
                }

            } else {
                console.log(`Error: No se ha encontrado ningún carrito con el id ingresado`);
                return null
            }

        } catch (error) {
            console.log(`Error: ${error}`);
            return null
        }
    }

    modifyProduct = async (CId, PId, newQ) => {

        try {
            const cart = await cartModel.findOne({ CId: CId })
            let products = cart.products
            let prodSet = products.map(prod => prod.product.toString())

            if (cart) {

                if (prodSet.has(PId)) {
                    let i = products.findIndex(el => el.product == PId)
                    products[i].quantity = newQ
                    let result = await cartModel.updateOne({ CId: CId }, { products: products })
                    return result
                } else {
                    console.log("El producto ingresado no se encuentra en el carrito");
                    return null
                }

            } else {
                console.log("No se ha encontrado el carrito ingresado");
                return null
            }

        } catch (error) {
            console.log(`Error: ${error}`);
            return null
        }


    }

    getCart = async (CId) => {
        const cart = await cartModel.findOne({ CId: CId })
        return cart
    }

    getCartByUser = async (userID) => {
        const cart = await cartModel.findOne({ user: userID })
        return cart
    }

}