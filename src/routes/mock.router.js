import { Router } from "express";
import { generateProduct } from "../middlewares/utils.js";

const router = Router()

router.get("/", async (req, res) => {
    let products = []

    for (let i = 0; i < 99; i++) {
        products.push(generateProduct())
    }
    res.send({ status: "Success", payload: products })
})

export default router