import jwt from 'jsonwebtoken'

export const genToken = (customerId) => {
    return jwt.sign({customerId}, process.env.jwt_secret, {expiresIn: "30d"})
}