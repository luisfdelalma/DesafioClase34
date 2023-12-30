import { usersServices } from "../repositories/index.js";
import { isValidatedPassword } from "../middlewares/utils.js";
import jwt from "jsonwebtoken"
import { io } from "../app.js";
import customError from "../repositories/errors/customError.js";
import EErrors from "../repositories/errors/enums.js";
import { registerUserErrorInfo } from "../repositories/errors/info.js";

export const loginG = (req, res) => {
    res.render("login")
}

export const loginP = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).send({ status: "error", error: "Faltan valores" })

    let user = await usersServices.getByEmail(email)
    req.logger.info(user)

    if (!user) return res.status(400).send({ status: "error", error: "Usuario no registrado" })

    if (!isValidatedPassword(user, password)) {
        req.logger.warning("Password incorrecto")
        res.status(403).send({ status: "error", error: "Password incorrecto" })
    } else {

        let token = jwt.sign({ email, password, role: user.role }, "coderKey", { expiresIn: "12h" })
        let userToken = user._id
        delete user.password
        res.cookie("CoderCookie", token, { maxAge: 60 * 60 * 12 * 1000, httpOnly: true })
        res.cookie("User", userToken, { maxAge: 60 * 60 * 12 * 1000, httpOnly: true })
        res.send({ message: "logged in!" })
    }
}

export const registerG = (req, res) => {
    res.render("register")
}

export const registerP = async (req, res, next) => {
    const { first_name, last_name, email, age } = req.body
    const user = await usersServices.getByEmail(req.body.email)
    try {
        if (user) {
            req.logger.warning("El usuario ya existe");
            res.render("useralreadyexists")
        } else {
            if (!first_name || !last_name || !email || !age) {
                customError.createError({
                    name: "User registrartion error",
                    cause: registerUserErrorInfo({ first_name, last_name, email, age }),
                    message: "Missing registration information",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            } else {
                let result = await usersServices.create(req.body)
                res.render("successregister")
            }
        }
    } catch (error) {
        next(error)
    }
}

export const current = (req, res) => {
    let { email, role } = req.user
    res.send({ status: "success", payload: { email, role } })
}

export const chat = (req, res) => {

    res.render("chat")

    const users = {}

    io.on("connection", (socket) => {
        console.log("User connected");

        socket.on("newUser", (username) => {
            users[socket.id] = username
            io.emit("userConnected", username)
        })

        socket.on("chatMessage", (message) => {
            const username = users[socket.id]
            io.emit("message", { username, message })
        })

        socket.on("disconnect", () => {
            const username = users[socket.id]
            delete users[socket.id]
            io.emit("userDisconnected", username)
        })
    })
}