import bcrypt from "bcrypt"
import passport from "passport"
import crypto from "crypto"
import { faker } from "@faker-js/faker"

faker.setLocale = "es"

export function createHash(password) { return bcrypt.hashSync(password, bcrypt.genSaltSync(10)) };

export function isValidatedPassword(user, password) { return bcrypt.compareSync(password, user.password) };

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err)
            if (!user) {
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() })
            }
            req.user = user
            next()
        })(req, res, next)
    }
}

export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({ error: "Unauthorized" })
        if (req.user.role != role) return res.status(403).send({ error: "No tiene permisos" })
        next()
    }
}

export const ticketCode = () => {
    const buffer = crypto.randomBytes(8)
    return buffer.toString("hex")
}

export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        BId: faker.number.int({ min: 100000, max: 999999 }),
        description: faker.commerce.productDescription(),
        code: faker.string.alphanumeric(10),
        price: faker.number.int({ min: 99, max: 2000 }),
        status: faker.datatype.boolean(0.7),
        stock: faker.number.int({ min: 43, max: 2000 }),
        category: faker.helpers.arrayElement(["Category A", "Category B", "Category C"]),
        thumbnail: faker.image.urlPicsumPhotos({ width: 128, height: 128 })
    }
}
