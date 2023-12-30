import { Router } from "express"
import { create, deleteP, searchG, searchId, update } from "../controllers/productsController.js"
import { authorization, passportCall } from "../middlewares/utils.js"

const router = Router()

router.get("/search", searchG)

router.get("/:pid", searchId)

router.post("/", passportCall("jwt"), authorization("admin"), create)

router.put("/:BId", passportCall("jwt"), authorization("admin"), update)

router.delete("/:BId", passportCall("jwt"), authorization("admin"), deleteP)



export default router