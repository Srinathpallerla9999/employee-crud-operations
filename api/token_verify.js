
const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(403).send({ message: "Unauthorized User" })
    }
    let token = req.headers.authorization.split(" ")[1]
    if(token === null) {
        return res.status(403).send({message:"Unauthorized User"})
    }
    let payload = jwt.verify(token, "mySecretKey")
    if(!payload) {
        return res.status(403).send({message:"Unauthorized User"})
    }
    req.userId = payload.subject
    next()
}

module.exports = verifyToken