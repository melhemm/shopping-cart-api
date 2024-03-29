const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token
  if(authHeader) {
    const token = authHeader.split(" ")[1]
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if(err) return res.status(401).json("Token is not vaild")
      req.user = user
      next()
    })
  } else {
    return res.status(401).json("You are not athenticated!")
  }
}

const verfiyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if(req.user.id === req.params.id || req.user.isAdmin) {
      next()
    } else {
      res.status(403).json("You are not alowed to do that!")
    }
  }) 
}

const verfiyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if(req.user.isAdmin) {
      next()
    } else {
      res.status(403).json("You are not alowed to do that!")
    }
  }) 
}


module.exports = { verifyToken, verfiyTokenAndAuthorization, verfiyTokenAndAdmin }
