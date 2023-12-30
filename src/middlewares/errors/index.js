import EErrors from "../../repositories/errors/enums.js";

export default (error, req, res, next) => {
    console.log(error.cause)
    switch (error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            res.status(400).send({ status: "Error", error: error.message })
            break;

        default:
            res.status(500).send({ status: "Error", error: "Unhandled error" })
            break;
    }

    next()
}