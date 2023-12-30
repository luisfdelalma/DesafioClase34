import dotenv from "dotenv"

dotenv.config()

export default {
    PORT: process.env.PORT,
    mongoURL: process.env.MONGO_URL,
    passportKey: process.env.Passport_key
}