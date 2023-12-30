import { Router } from "express";

const router = Router()

router.get("/", (req, res) => {
    req.logger.debug("Mensaje a nivel debug")
    req.logger.http("Mensaje a nivel http")
    req.logger.info("Mensaje de nivel info")
    req.logger.warning("Mensaje a nivel warning")
    req.logger.error("Mensaje a nivel error")
    req.logger.fatal("Mensaje a nivel fatal")

    res.send("Registros")
})

export default router