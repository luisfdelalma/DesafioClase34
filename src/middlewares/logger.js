import winston from "winston"
import { createLogger, format, transports } from "winston";

// CONFIG LEVELS PERSONALIZADOS

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    }
}

// CONFIG A NIVEL DESARROLLO

const devLogger = createLogger({
    levels: customLevelsOptions.levels,
    level: "debug",
    format: format.simple(),
    transports: [new transports.Console()]
})

//CONFIG A NIVEL PRODUCCION

const prodLogger = createLogger({
    levels: customLevelsOptions.levels,
    format: format.simple(),
    transports: [
        new transports.Console({ level: "info" }),
        new transports.File({
            filename: "error.log",
            level: "error"
        })
    ]
})

export const addLogger = (req, res, next) => {
    if (process.env.NODE_ENV === "production") {
        req.logger = prodLogger
    } else {
        req.logger = devLogger
    }
    next()
}