import { Router } from "express"
import { addToCart, create, deleteCart, deleteProduct, getCart, modifyCart, modifyProduct, purchase } from "../controllers/cartsController.js"
import { passportCall, authorization } from "../middlewares/utils.js"

const router = Router()

router.post("/", create)

router.delete("/:cid", deleteCart)

router.delete("/:cid/products/:pid", deleteProduct)

router.put("/:cid", modifyCart)

router.put("/:cid/products/:pid", modifyProduct)

router.get("/:cid", passportCall("jwt"), authorization("user"), getCart)

router.post("/toCart/:pid", passportCall("jwt"), authorization("user"), addToCart)

router.post("/:cid/purchase", passportCall("jwt"), authorization("user"), purchase)



export default router