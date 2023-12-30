import { Router } from "express"
import passport from "passport"

const router = Router()

// IMPORTACIONES (RUTAS) NUEVAS
import { chat, current, loginG, loginP, registerG, registerP } from "../controllers/usersController.js"
import { authorization, passportCall } from "../middlewares/utils.js"

// VERSION NUEVA
router.get("/register", registerG)

router.post("/register", registerP)

router.get("/login", loginG)

router.post("/login", loginP)

router.get("/current", passportCall("jwt"), authorization("admin"), current)

router.get("/chat", passportCall("jwt"), authorization("user"), chat)

export default router