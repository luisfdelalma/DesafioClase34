import express from "express"
import exphbs from "express-handlebars"
import mongoose from "mongoose"
import path from "path"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import initializePassport from "./config/passport.config.js"
import passport from "passport"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import "./config/config.js"
import compression from "express-compression"
import errorHandler from "./middlewares/errors/index.js"
import { addLogger } from "./middlewares/logger.js"

//SOCKETS IMPORTS
import http from "http"
import { Server } from "socket.io"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express()
const PORT = process.env.PORT


// IMPORTACION DE RUTAS
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import usersRouter from "./routes/users.router.js"
import mockRouter from "./routes/mock.router.js"
import loggerRouter from "./routes/logger.router.js"

// HANDLE BARS CONFIG
app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, 'public')))

//CHAT CONFIG
const server = http.createServer(app)
export const io = new Server(server)


// SERVER CONFIG
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
initializePassport()
app.use(passport.initialize())
app.use(addLogger)



const environment = async () => {
    await mongoose.connect(process.env.MONGO_URL)
}
environment()

app.use("/api/users", usersRouter)
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/mockingproducts", mockRouter)
app.use("/loggerTest", loggerRouter)

app.use(errorHandler)

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// })

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})