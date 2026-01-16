const jwt = require('jsonwebtoken');
const JWT_SECRET = 'MySecretKey';

async function authentication(req, res, next) {

   try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied."
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Access denied."
    });
  }
}



module.exports = authentication;
