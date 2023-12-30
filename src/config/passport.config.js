import passport from "passport"
import jwt from "passport-jwt"

const JWTStrategy = jwt.Strategy
const extractJWT = jwt.ExtractJwt

const cookieExtractor = req => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies["CoderCookie"]
    }
    return token
}

const initializePassport = () => {

    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: extractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.Passport_key
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }
    ))


}

export default initializePassport