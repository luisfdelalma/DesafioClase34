export default class customError {
    static createError({ name, cause, message, code }) {
        const error = new Error(message)
        error.name = name
        error.code = code
        error.cause = cause
        throw error
    }
}